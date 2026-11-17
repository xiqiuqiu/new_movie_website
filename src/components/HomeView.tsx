import { Bookmark, ChevronRight, Play, X } from 'lucide-react';
import type { HistoryEntry, MediaItem, MediaKind } from '../types/media';
import { PosterArtwork } from './PosterArtwork';

interface HomeViewProps {
  catalog: MediaItem[];
  history: HistoryEntry[];
  favoriteIds: string[];
  onPlayMedia: (item: MediaItem, episode?: number, sourceName?: string) => void;
  onToggleFavorite: (mediaId: string) => void;
  onRemoveHistoryItem: (mediaId: string) => void;
  onOpenDiscoverKind: (kind: MediaKind) => void;
  onOpenHistory: () => void;
}

export function HomeView({
  catalog,
  history,
  favoriteIds,
  onPlayMedia,
  onToggleFavorite,
  onRemoveHistoryItem,
  onOpenDiscoverKind,
  onOpenHistory,
}: HomeViewProps) {
  const continueItems = history
    .map((entry) => {
      const item = catalog.find((m) => m.id === entry.mediaId);
      return item ? { entry, item } : null;
    })
    .filter((pair): pair is { entry: HistoryEntry; item: MediaItem } => pair !== null);

  const heroEntry = continueItems[0] ?? {
    item: catalog[0],
    entry: {
      mediaId: catalog[0].id,
      episode: 1,
      progressPercent: 0,
      sourceName: catalog[0].sources[0]?.name ?? '如意资源',
      watchedAtIso: '',
      positionSeconds: 0,
    },
  };

  const heroItem = heroEntry.item;
  const heroIsFav = favoriteIds.includes(heroItem.id);

  const shelves: Array<{ title: string; subtitle: string; kind: MediaKind; items: MediaItem[] }> = [
    {
      title: '热门电影',
      subtitle: '院线热映与高口碑银幕精选',
      kind: 'movie',
      items: catalog.filter((m) => m.kind === 'movie'),
    },
    {
      title: '热门剧集',
      subtitle: '口碑国产剧与海外佳作连载',
      kind: 'series',
      items: catalog.filter((m) => m.kind === 'series'),
    },
    {
      title: '热门综艺',
      subtitle: '高分纪实真人秀与轻松下饭特辑',
      kind: 'variety',
      items: catalog.filter((m) => m.kind === 'variety'),
    },
  ];

  return (
    <div className="space-y-12">
      {/* Editorial Screening Spotlight Hero (Replaces the dry header on original site) */}
      <section
        aria-label="今日放映精选"
        className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-[#111318] text-[#F4F2ED]"
      >
        <div className="grid lg:grid-cols-12 items-stretch min-h-[340px] lg:min-h-[380px]">
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10 bg-gradient-to-r from-[#0C0E13] via-[#0C0E13]/95 to-[#0C0E13]/85 lg:to-transparent">
            <div>
              <p className="text-xs font-medium tracking-[0.08em] text-amber-400">
                今日私人放映 · 接着上次进度
              </p>
              <h1 className="font-display mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white [text-wrap:balance]">
                {heroItem.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-white/75 font-mono-tabular">
                <span>{heroItem.genreLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{heroItem.year}</span>
                {heroItem.rating && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-300 font-semibold">豆瓣 {heroItem.rating.toFixed(1)}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{heroEntry.entry.sourceName}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/75 line-clamp-3 max-w-xl">
                {heroItem.synopsis}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onPlayMedia(heroItem, heroEntry.entry.episode, heroEntry.entry.sourceName)
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#E5A93C] px-5 py-2.5 text-sm font-semibold text-[#0A0B0E] hover:bg-[#EEB854] transition-colors whitespace-nowrap shrink-0"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                <span>
                  {heroEntry.entry.progressPercent > 0
                    ? `继续第 ${heroEntry.entry.episode} 集 (${heroEntry.entry.progressPercent}%)`
                    : '立即放映'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onToggleFavorite(heroItem.id)}
                aria-pressed={heroIsFav}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  heroIsFav
                    ? 'border-amber-400/50 bg-amber-400/15 text-amber-200'
                    : 'border-white/20 bg-white/5 text-white/90 hover:bg-white/10'
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${heroIsFav ? 'fill-current' : ''}`}
                  aria-hidden="true"
                />
                <span>{heroIsFav ? '已收藏' : '加入收藏'}</span>
              </button>
            </div>
          </div>

          <div className="relative lg:col-span-6 min-h-[220px] lg:min-h-full">
            <img
              src={heroItem.backdropImage ?? heroItem.posterImage}
              alt={`${heroItem.title} 剧照`}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0C0E13] via-[#0C0E13]/35 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* Quick Category Jump Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.07] dark:border-white/[0.08] pb-4">
        <div>
          <h2 className="text-lg font-semibold text-[#14161A] dark:text-[#F4F2ED]">片库频道</h2>
          <p className="text-xs text-[#5D6470] dark:text-[#8F96A3] mt-0.5">
            按类型直达豆瓣热门片单与多线路资源
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(
            [
              { kind: 'movie', label: '电影' },
              { kind: 'series', label: '剧集' },
              { kind: 'variety', label: '综艺' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.kind}
              type="button"
              onClick={() => onOpenDiscoverKind(cat.kind)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] px-4 py-2 text-xs font-medium text-[#14161A] dark:text-[#F4F2ED] hover:border-amber-600/50 dark:hover:border-amber-400/50 hover:text-amber-700 dark:hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
            >
              <span>{cat.label}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      {/* Continue Watching Rail */}
      {continueItems.length > 0 && (
        <section aria-label="继续观看">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight text-[#14161A] dark:text-[#F4F2ED]">
              继续观看
            </h2>
            <button
              type="button"
              onClick={onOpenHistory}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#5D6470] dark:text-[#8F96A3] hover:text-amber-700 dark:hover:text-amber-300 transition-colors whitespace-nowrap"
            >
              <span>全部历史</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="rail-scroll flex gap-4 overflow-x-auto pb-2">
            {continueItems.map(({ entry, item }) => (
              <article
                key={item.id}
                className="group relative w-[276px] sm:w-[300px] shrink-0 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] overflow-hidden transition-colors hover:border-amber-600/45 dark:hover:border-amber-400/45"
              >
                <div className="relative aspect-video w-full">
                  <PosterArtwork item={item} variant="landscape" className="h-full w-full" />

                  <button
                    type="button"
                    onClick={() => onPlayMedia(item, entry.episode, entry.sourceName)}
                    aria-label={`继续播放 ${item.title} 第 ${entry.episode} 集`}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/35 transition-colors focus-visible:bg-black/40"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#E5A93C] text-[#0A0B0E] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:scale-105 transition-all shadow-lg">
                      <Play className="h-4.5 w-4.5 fill-current ml-0.5" aria-hidden="true" />
                    </span>
                  </button>

                  <span className="pointer-events-none absolute right-2.5 top-2.5 rounded bg-black/70 px-1.5 py-0.5 font-mono-tabular text-[11px] font-medium text-white/90">
                    {entry.episode}/{item.episodesCount}
                  </span>

                  <button
                    type="button"
                    onClick={() => onRemoveHistoryItem(item.id)}
                    aria-label={`从继续观看移除 ${item.title}`}
                    className="absolute left-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/65 text-white/80 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-black/85 hover:text-white transition-opacity"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  {/* Integrated Progress Hairline */}
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-[#E5A93C]"
                      style={{ width: `${Math.max(4, entry.progressPercent)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => onPlayMedia(item, entry.episode, entry.sourceName)}
                      className="text-left text-sm font-semibold text-[#14161A] dark:text-[#F4F2ED] hover:text-amber-700 dark:hover:text-amber-300 truncate block w-full"
                    >
                      {item.title}
                    </button>
                    <p className="mt-1 text-xs text-[#5D6470] dark:text-[#8F96A3] font-mono-tabular truncate">
                      第 {entry.episode} 集 · 已看 {entry.progressPercent}% · {entry.sourceName}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Curated Poster Rails (Movies / Series / Variety) */}
      {shelves.map((shelf) => (
        <section key={shelf.kind} aria-label={shelf.title}>
          <div className="flex items-end justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#14161A] dark:text-[#F4F2ED]">
                {shelf.title}
              </h2>
              <p className="text-xs text-[#5D6470] dark:text-[#8F96A3] mt-0.5">{shelf.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => onOpenDiscoverKind(shelf.kind)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#5D6470] dark:text-[#8F96A3] hover:text-amber-700 dark:hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
            >
              <span>查看更多</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {shelf.items.slice(0, 6).map((item) => {
              const isFav = favoriteIds.includes(item.id);
              return (
                <article key={item.id} className="group flex flex-col">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-[#14161D] transition-colors group-hover:border-amber-600/50 dark:group-hover:border-amber-400/50">
                    <PosterArtwork item={item} variant="poster" className="h-full w-full" />

                    <button
                      type="button"
                      onClick={() => onPlayMedia(item, 1, item.sources[0]?.name)}
                      aria-label={`播放 ${item.title}`}
                      className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity"
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E5A93C] px-2.5 py-1.5 text-xs font-semibold text-[#0A0B0E]">
                        <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                        放映
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      aria-pressed={isFav}
                      aria-label={isFav ? `取消收藏 ${item.title}` : `收藏 ${item.title}`}
                      className={`absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-sm transition-all ${
                        isFav
                          ? 'bg-[#E5A93C] text-[#0A0B0E] opacity-100'
                          : 'bg-black/55 text-white/85 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-black/80'
                      }`}
                    >
                      <Bookmark
                        className={`h-3.5 w-3.5 ${isFav ? 'fill-current' : ''}`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {/* Clean Unboxed Metadata Caption */}
                  <div className="mt-2.5 px-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onPlayMedia(item, 1, item.sources[0]?.name)}
                        className="text-left text-sm font-medium text-[#14161A] dark:text-[#F4F2ED] hover:text-amber-700 dark:hover:text-amber-300 truncate"
                      >
                        {item.title}
                      </button>
                      {item.rating !== null && (
                        <span className="font-mono-tabular text-xs font-semibold text-amber-700 dark:text-[#E5A93C] shrink-0">
                          {item.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-[#5D6470] dark:text-[#8F96A3] font-mono-tabular truncate">
                      {item.year} · {item.genreLabel.split('·')[0].trim()}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
