import type {
  AiMatchResult,
  DiscoverFilterState,
  EpisodeChunk,
  HistoryEntry,
  MediaItem,
  MediaKind,
} from '../types/media';

export function filterDiscoverCatalog(
  items: MediaItem[],
  filters: DiscoverFilterState
): MediaItem[] {
  const filtered = items.filter((item) => {
    if (item.kind !== filters.kind) return false;
    if (filters.region !== 'all' && item.region !== filters.region) return false;
    if (!item.collections.includes(filters.collection)) return false;
    return true;
  });

  if (filters.sortBy === 'rating_desc') {
    return [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }
  if (filters.sortBy === 'year_desc') {
    return [...filtered].sort((a, b) => b.year - a.year || (b.rating ?? 0) - (a.rating ?? 0));
  }
  return filtered;
}

export interface SearchResultGroup {
  item: MediaItem;
  totalSourceHits: number;
}

export function searchCatalog(
  items: MediaItem[],
  query: string,
  kindFilter: MediaKind | 'all',
  aggregateSources: boolean
): {
  results: SearchResultGroup[];
  countsByKind: Record<MediaKind | 'all', number>;
} {
  const trimmed = query.trim().toLowerCase();
  const matched = trimmed
    ? items.filter((item) => {
        const haystack = [
          item.title,
          item.originalTitle ?? '',
          item.genreLabel,
          item.directorOrHost,
          item.synopsis,
          String(item.year),
          ...item.cast,
          ...item.tags,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(trimmed);
      })
    : items;

  const countsByKind: Record<MediaKind | 'all', number> = {
    all: matched.length,
    movie: matched.filter((m) => m.kind === 'movie').length,
    series: matched.filter((m) => m.kind === 'series').length,
    variety: matched.filter((m) => m.kind === 'variety').length,
  };

  const kindFiltered =
    kindFilter === 'all' ? matched : matched.filter((item) => item.kind === kindFilter);

  if (aggregateSources) {
    return {
      results: kindFiltered.map((item) => ({
        item,
        totalSourceHits: item.sources.length,
      })),
      countsByKind,
    };
  }

  // Non-aggregated mode expands each source into an individual hit card
  const expanded: SearchResultGroup[] = [];
  for (const item of kindFiltered) {
    for (const source of item.sources) {
      expanded.push({
        item: {
          ...item,
          sources: [source],
        },
        totalSourceHits: 1,
      });
    }
  }
  return {
    results: expanded,
    countsByKind,
  };
}

const KEYWORD_SYNONYMS: Array<{ patterns: string[]; tags: string[]; label: string }> = [
  { patterns: ['律师', '律政', '法庭', '正义', '喜剧', '东北'], tags: ['律政', '喜剧', '现实', '东北'], label: '律政与现实喜剧线索' },
  { patterns: ['历史', '改革', '年代', '1948', '民国', '战争', '抗战', '谍战'], tags: ['历史', '年代', '谍战', '战争', '经典'], label: '年代历史与厚重叙事' },
  { patterns: ['悬疑', '犯罪', '侦探', '罪案', '烧脑', '反转'], tags: ['悬疑', '犯罪', '烧脑', '推理'], label: '强悬疑与高能反转' },
  { patterns: ['科幻', '史诗', '冒险', '太空', '动作'], tags: ['史诗', '科幻', '动作', '冒险'], label: '大银幕史诗与视听张力' },
  { patterns: ['轻松', '下饭', '综艺', '农场', '旅行', '治愈', '慢生活'], tags: ['治愈', '真人秀', '旅行', '农场', '下饭'], label: '轻松治愈与高口碑真人秀' },
  { patterns: ['高分', '经典', '必看', '豆瓣'], tags: ['高分', '经典'], label: '高口碑必看片单' },
];

export function aiMatchCatalog(items: MediaItem[], clue: string): AiMatchResult[] {
  const normalized = clue.trim().toLowerCase();
  if (!normalized) return [];

  const tokens = normalized
    .split(/[\s,，。、；;]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const activeConcepts = KEYWORD_SYNONYMS.filter((group) =>
    group.patterns.some((p) => normalized.includes(p))
  );

  const scored: AiMatchResult[] = [];

  for (const item of items) {
    let score = 0;
    const reasons: string[] = [];

    const fullText = [
      item.title,
      item.genreLabel,
      item.directorOrHost,
      item.synopsis,
      ...item.cast,
      ...item.tags,
      String(item.year),
    ]
      .join(' ')
      .toLowerCase();

    for (const token of tokens) {
      if (item.title.toLowerCase().includes(token)) {
        score += 40;
        reasons.push(`片名直接匹配「${token}」`);
      } else if (fullText.includes(token)) {
        score += 18;
        reasons.push(`剧情与标签包含「${token}」`);
      }
    }

    for (const concept of activeConcepts) {
      const hitTag = concept.tags.some(
        (tag) => item.tags.includes(tag) || item.genreLabel.includes(tag) || item.synopsis.includes(tag)
      );
      if (hitTag) {
        score += 22;
        reasons.push(concept.label);
      }
    }

    if ((normalized.includes('高分') || normalized.includes('经典')) && (item.rating ?? 0) >= 8.2) {
      score += 18;
      reasons.push(`豆瓣 ${item.rating?.toFixed(1)} 高分`);
    }

    if (score > 0) {
      const uniqueReasons = Array.from(new Set(reasons));
      scored.push({
        item,
        score,
        reason: uniqueReasons.slice(0, 2).join(' · '),
      });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score || (b.item.rating ?? 0) - (a.item.rating ?? 0))
    .slice(0, 8);
}

export function computeEpisodeChunks(
  totalEpisodes: number,
  chunkSize = 10,
  descending = false
): EpisodeChunk[] {
  if (totalEpisodes <= 0) return [];
  const safeChunk = Math.max(1, chunkSize);
  const chunks: EpisodeChunk[] = [];

  for (let start = 1; start <= totalEpisodes; start += safeChunk) {
    const end = Math.min(totalEpisodes, start + safeChunk - 1);
    const episodes: number[] = [];
    for (let ep = start; ep <= end; ep++) {
      episodes.push(ep);
    }
    if (descending) {
      episodes.reverse();
    }
    chunks.push({
      label: start === end ? `${start}` : `${start}-${end}`,
      start,
      end,
      episodes,
    });
  }

  if (descending) {
    chunks.reverse();
  }
  return chunks;
}

export function formatTimecode(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(clamped / 3600);
  const minutes = Math.floor((clamped % 3600) / 60);
  const seconds = clamped % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function groupHistoryByRecency(
  entries: HistoryEntry[],
  referenceTimeMs = Date.now()
): { today: HistoryEntry[]; earlier: HistoryEntry[] } {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const sorted = [...entries].sort(
    (a, b) => new Date(b.watchedAtIso).getTime() - new Date(a.watchedAtIso).getTime()
  );
  const today: HistoryEntry[] = [];
  const earlier: HistoryEntry[] = [];

  for (const entry of sorted) {
    const diff = referenceTimeMs - new Date(entry.watchedAtIso).getTime();
    if (diff <= oneDayMs && diff >= -60_000) {
      today.push(entry);
    } else {
      earlier.push(entry);
    }
  }
  return { today, earlier };
}

export function toggleFavoriteIds(currentIds: string[], mediaId: string): string[] {
  return currentIds.includes(mediaId)
    ? currentIds.filter((id) => id !== mediaId)
    : [mediaId, ...currentIds];
}

export function upsertHistoryProgress(
  entries: HistoryEntry[],
  next: HistoryEntry
): HistoryEntry[] {
  const rest = entries.filter((entry) => entry.mediaId !== next.mediaId);
  return [next, ...rest];
}
