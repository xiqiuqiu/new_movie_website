import { useState } from 'react';
import { Bookmark, Play, Trash2 } from 'lucide-react';
import type { MediaItem, MediaKind } from '../types/media';
import { PosterArtwork } from './PosterArtwork';

interface FavoritesViewProps {
  catalog: MediaItem[];
  favoriteIds: string[];
  onToggleFavorite: (mediaId: string) => void;
  onPlayMedia: (item: MediaItem) => void;
  onExploreDiscover: () => void;
}

export function FavoritesView({
  catalog,
  favoriteIds,
  onToggleFavorite,
  onPlayMedia,
  onExploreDiscover,
}: FavoritesViewProps) {
  const [kindFilter, setKindFilter] = useState<MediaKind | 'all'>('all');

  const favorites = catalog.filter(
    (item) => favoriteIds.includes(item.id) && (kindFilter === 'all' || item.kind === kindFilter)
  );

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/[0.08] dark:border-white/[0.08] pb-5">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#14161A] dark:text-[#F4F2ED]">
            我的收藏夹
          </h1>
          <p className="mt-1 text-sm text-[#5D6470] dark:text-[#8F96A3] font-mono-tabular">
            已保存 {favoriteIds.length} 部想看片目
          </p>
        </div>

        <div className="flex items-center gap-1.5" role="group" aria-label="收藏分类筛选">
          {(
            [
              { id: 'all', label: '全部' },
              { id: 'movie', label: '电影' },
              { id: 'series', label: '剧集' },
              { id: 'variety', label: '综艺' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={kindFilter === tab.id}
              onClick={() => setKindFilter(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap ${
                kindFilter === tab.id
                  ? 'border-amber-600/60 dark:border-amber-400/60 bg-amber-500/12 text-amber-800 dark:text-amber-300'
                  : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] text-[#4B525E] dark:text-[#9CA3AF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] p-14 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-[#8F96A3]" aria-hidden="true" />
          <p className="mt-3 text-base font-medium text-[#14161A] dark:text-[#F4F2ED]">
            {favoriteIds.length === 0 ? '暂无收藏内容' : '当前分类下暂无收藏'}
          </p>
          <p className="mt-1 text-xs text-[#5D6470] dark:text-[#8F96A3]">
            在首页、发现页或放映页点击收藏按钮，想看的片单会自动汇集于此。
          </p>
          <button
            type="button"
            onClick={onExploreDiscover}
            className="mt-5 inline-flex items-center rounded-lg bg-[#14161A] dark:bg-[#E5A93C] px-4 py-2 text-xs font-semibold text-white dark:text-[#0A0B0E]"
          >
            去发现片单
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {favorites.map((item) => (
            <article key={item.id} className="group flex flex-col">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-black/[0.08] dark:border-white/[0.08]">
                <PosterArtwork item={item} variant="poster" className="h-full w-full" />
                <button
                  type="button"
                  onClick={() => onPlayMedia(item)}
                  aria-label={`播放 ${item.title}`}
                  className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#E5A93C] px-2.5 py-1.5 text-xs font-semibold text-[#0A0B0E]">
                    <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                    放映
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleFavorite(item.id)}
                  aria-label={`移除收藏 ${item.title}`}
                  className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black/65 text-white hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onPlayMedia(item)}
                  className="text-left text-sm font-medium text-[#14161A] dark:text-[#F4F2ED] hover:text-amber-700 dark:hover:text-amber-300 truncate"
                >
                  {item.title}
                </button>
                {item.rating && (
                  <span className="font-mono-tabular text-xs font-semibold text-amber-700 dark:text-[#E5A93C] shrink-0">
                    {item.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
