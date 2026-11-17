import { Bookmark, Play } from 'lucide-react';
import type {
  DiscoverCollection,
  DiscoverFilterState,
  MediaItem,
  MediaKind,
  MediaRegion,
  SortOption,
} from '../types/media';
import { filterDiscoverCatalog } from '../utils/catalogLogic';
import { PosterArtwork } from './PosterArtwork';

interface DiscoverViewProps {
  catalog: MediaItem[];
  filters: DiscoverFilterState;
  onChangeFilters: (next: DiscoverFilterState) => void;
  favoriteIds: string[];
  onToggleFavorite: (mediaId: string) => void;
  onPlayMedia: (item: MediaItem) => void;
}

const KIND_TABS: Array<{ id: MediaKind; label: string; subtitle: string }> = [
  { id: 'movie', label: '电影', subtitle: '豆瓣热门与高分银幕片单' },
  { id: 'series', label: '剧集', subtitle: '华语年代大剧与高分海外剧' },
  { id: 'variety', label: '综艺', subtitle: '高口碑真人秀与纪实特辑' },
];

const COLLECTION_TABS: Array<{ id: DiscoverCollection; label: string }> = [
  { id: 'popular', label: '热门精选' },
  { id: 'latest', label: '最新上线' },
  { id: 'top_rated', label: '豆瓣高分' },
  { id: 'hidden_gems', label: '冷门佳片' },
];

const REGION_TABS: Array<{ id: MediaRegion; label: string }> = [
  { id: 'all', label: '全部地区' },
  { id: 'chinese', label: '华语' },
  { id: 'western', label: '欧美' },
  { id: 'korean', label: '韩国' },
  { id: 'japanese', label: '日本' },
];

export function DiscoverView({
  catalog,
  filters,
  onChangeFilters,
  favoriteIds,
  onToggleFavorite,
  onPlayMedia,
}: DiscoverViewProps) {
  const activeKindMeta = KIND_TABS.find((t) => t.id === filters.kind) ?? KIND_TABS[0];
  const filteredItems = filterDiscoverCatalog(catalog, filters);

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/[0.08] dark:border-white/[0.08] pb-5">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#14161A] dark:text-[#F4F2ED]">
            发现 · {activeKindMeta.label}
          </h1>
          <p className="mt-1 text-sm text-[#5D6470] dark:text-[#8F96A3]">{activeKindMeta.subtitle}</p>
        </div>

        <div
          role="tablist"
          aria-label="内容类型"
          className="inline-flex items-center gap-1 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] p-1 self-start sm:self-auto"
        >
          {KIND_TABS.map((tab) => {
            const active = filters.kind === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChangeFilters({ ...filters, kind: tab.id })}
                className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#14161A] text-white dark:bg-[#E5A93C] dark:text-[#0A0B0E]'
                    : 'text-[#5D6470] dark:text-[#9CA3AF] hover:text-[#14161A] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Collection Filter */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="榜单筛选">
            {COLLECTION_TABS.map((col) => {
              const active = filters.collection === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChangeFilters({ ...filters, collection: col.id })}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-amber-600/60 dark:border-amber-400/60 bg-amber-500/12 text-amber-800 dark:text-amber-300'
                      : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] text-[#4B525E] dark:text-[#9CA3AF] hover:border-black/20 dark:hover:border-white/20'
                  }`}
                >
                  {col.label}
                </button>
              );
            })}
          </div>

          <span className="hidden lg:inline h-4 w-px bg-black/10 dark:bg-white/10" aria-hidden="true" />

          {/* Region Filter */}
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="地区筛选">
            {REGION_TABS.map((reg) => {
              const active = filters.region === reg.id;
              return (
                <button
                  key={reg.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChangeFilters({ ...filters, region: reg.id })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#14161A]/10 dark:bg-white/12 text-[#14161A] dark:text-white font-semibold'
                      : 'text-[#5D6470] dark:text-[#8F96A3] hover:text-[#14161A] dark:hover:text-white'
                  }`}
                >
                  {reg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Selector & Result Count */}
        <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
          <span className="text-xs text-[#5D6470] dark:text-[#8F96A3] font-mono-tabular">
            共 {filteredItems.length} 部
          </span>
          <label className="inline-flex items-center gap-2 text-xs text-[#5D6470] dark:text-[#8F96A3]">
            <span>排序</span>
            <select
              aria-label="片单排序"
              value={filters.sortBy}
              onChange={(e) =>
                onChangeFilters({ ...filters, sortBy: e.target.value as SortOption })
              }
              className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] px-2.5 py-1.5 text-xs font-medium text-[#14161A] dark:text-[#F4F2ED] focus:outline-none focus:border-amber-500"
            >
              <option value="default">默认推荐</option>
              <option value="rating_desc">评分最高</option>
              <option value="year_desc">年份最新</option>
            </select>
          </label>
        </div>
      </div>

      {/* Results Grid or Clean Empty State */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] p-12 text-center">
          <p className="text-base font-medium text-[#14161A] dark:text-[#F4F2ED]">
            当前筛选条件下暂无片目
          </p>
          <p className="mt-1.5 text-xs text-[#5D6470] dark:text-[#8F96A3]">
            试试切换为「全部地区」或查看「热门精选」榜单。
          </p>
          <button
            type="button"
            onClick={() =>
              onChangeFilters({
                ...filters,
                collection: 'popular',
                region: 'all',
                sortBy: 'default',
              })
            }
            className="mt-5 inline-flex items-center rounded-lg bg-[#14161A] dark:bg-[#E5A93C] px-4 py-2 text-xs font-semibold text-white dark:text-[#0A0B0E] hover:opacity-90 transition-opacity"
          >
            重置筛选条件
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {filteredItems.map((item) => {
            const isFav = favoriteIds.includes(item.id);
            return (
              <article key={item.id} className="group flex flex-col">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-[#14161D] transition-colors group-hover:border-amber-600/50 dark:group-hover:border-amber-400/50">
                  <PosterArtwork item={item} variant="poster" className="h-full w-full" />
                  <button
                    type="button"
                    onClick={() => onPlayMedia(item)}
                    aria-label={`播放 ${item.title}`}
                    className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity"
                  >
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E5A93C] px-2.5 py-1.5 text-xs font-semibold text-[#0A0B0E]">
                      <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                      立即播放
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

                <div className="mt-2.5 px-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onPlayMedia(item)}
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
                    {item.year} · {item.sources.length} 条线路
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
