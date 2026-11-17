import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aiMatchCatalog,
  computeEpisodeChunks,
  filterDiscoverCatalog,
  formatTimecode,
  groupHistoryByRecency,
  searchCatalog,
  toggleFavoriteIds,
  upsertHistoryProgress,
} from './catalogLogic';
import { CATALOG_ITEMS } from '../data/catalog';

test('filterDiscoverCatalog filters by kind, collection, region and sorts by rating', () => {
  const results = filterDiscoverCatalog(CATALOG_ITEMS, {
    kind: 'movie',
    collection: 'popular',
    region: 'western',
    sortBy: 'rating_desc',
  });
  assert.ok(results.length >= 2);
  for (const item of results) {
    assert.equal(item.kind, 'movie');
    assert.equal(item.region, 'western');
    assert.ok(item.collections.includes('popular'));
  }
  for (let i = 1; i < results.length; i++) {
    assert.ok((results[i - 1].rating ?? 0) >= (results[i].rating ?? 0));
  }
});

test('searchCatalog respects aggregateSources toggle', () => {
  const aggregated = searchCatalog(CATALOG_ITEMS, '蒸蒸日上', 'all', true);
  assert.ok(aggregated.results.length >= 1);
  assert.equal(aggregated.results[0].item.title, '蒸蒸日上');
  assert.ok(aggregated.results[0].totalSourceHits > 1);

  const expanded = searchCatalog(CATALOG_ITEMS, '蒸蒸日上', 'all', false);
  assert.ok(expanded.results.length >= aggregated.results[0].totalSourceHits);
});

test('aiMatchCatalog ranks relevant titles for semantic clues', () => {
  const matches = aiMatchCatalog(CATALOG_ITEMS, '东北 律师 喜剧');
  assert.ok(matches.length >= 1);
  assert.equal(matches[0].item.title, '蒸蒸日上');
  assert.ok(matches[0].reason.length > 0);
});

test('computeEpisodeChunks slices episodes cleanly ascending and descending', () => {
  const asc = computeEpisodeChunks(22, 10, false);
  assert.deepEqual(
    asc.map((c) => c.label),
    ['1-10', '11-20', '21-22']
  );
  assert.deepEqual(asc[2].episodes, [21, 22]);

  const desc = computeEpisodeChunks(22, 10, true);
  assert.deepEqual(
    desc.map((c) => c.label),
    ['21-22', '11-20', '1-10']
  );
  assert.deepEqual(desc[0].episodes, [22, 21]);
});

test('formatTimecode formats mm:ss and hh:mm:ss reliably', () => {
  assert.equal(formatTimecode(0), '00:00');
  assert.equal(formatTimecode(185), '03:05');
  assert.equal(formatTimecode(3665), '01:01:05');
});

test('groupHistoryByRecency splits today vs earlier items', () => {
  const now = new Date('2026-11-16T18:00:00Z').getTime();
  const grouped = groupHistoryByRecency(
    [
      {
        mediaId: 'a',
        episode: 2,
        progressPercent: 7,
        sourceName: '如意资源',
        watchedAtIso: '2026-11-16T16:00:00Z',
        positionSeconds: 180,
      },
      {
        mediaId: 'b',
        episode: 1,
        progressPercent: 4,
        sourceName: '如意资源',
        watchedAtIso: '2026-10-22T09:06:00Z',
        positionSeconds: 120,
      },
    ],
    now
  );
  assert.equal(grouped.today.length, 1);
  assert.equal(grouped.today[0].mediaId, 'a');
  assert.equal(grouped.earlier.length, 1);
  assert.equal(grouped.earlier[0].mediaId, 'b');
});

test('toggleFavoriteIds and upsertHistoryProgress mutate lists immutably', () => {
  const added = toggleFavoriteIds(['a'], 'b');
  assert.deepEqual(added, ['b', 'a']);
  const removed = toggleFavoriteIds(added, 'b');
  assert.deepEqual(removed, ['a']);

  const updated = upsertHistoryProgress(
    [
      {
        mediaId: 'a',
        episode: 1,
        progressPercent: 5,
        sourceName: '如意资源',
        watchedAtIso: '2026-10-20T10:00:00Z',
        positionSeconds: 90,
      },
    ],
    {
      mediaId: 'a',
      episode: 2,
      progressPercent: 18,
      sourceName: '如意资源',
      watchedAtIso: '2026-11-16T17:00:00Z',
      positionSeconds: 420,
    }
  );
  assert.equal(updated.length, 1);
  assert.equal(updated[0].episode, 2);
  assert.equal(updated[0].progressPercent, 18);
});
