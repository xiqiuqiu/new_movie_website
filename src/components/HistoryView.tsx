import { useState } from 'react';
import { History, Play, Trash2 } from 'lucide-react';
import type { HistoryEntry, MediaItem } from '../types/media';
import { groupHistoryByRecency } from '../utils/catalogLogic';
import { PosterArtwork } from './PosterArtwork';

interface HistoryViewProps {
  catalog: MediaItem[];
  history: HistoryEntry[];
  onPlayMedia: (item: MediaItem, episode?: number, sourceName?: string) => void;
  onDeleteHistoryItems: (mediaIds: string[]) => void;
  onBackHome: () => void;
}

export function HistoryView({
  catalog,
  history,
  onPlayMedia,
  onDeleteHistoryItems,
  onBackHome,
}: HistoryViewProps) {
  const [manageMode, setManageMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { today, earlier } = groupHistoryByRecency(history);

  const toggleSelect = (mediaId: string) => {
    setSelectedIds((prev) =>
      prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]
    );
  };

  const renderGroup = (title: string, entries: HistoryEntry[]) => {
    if (entries.length === 0) return null;
    return (
      <section aria-label={title} className="space-y-3">
        <h2 className="text-sm font-semibold text-[#5D6470] dark:text-[#8F96A3]">{title}</h2>
        <div className="divide-y divide-black/[0.06] dark:divide-white/[0.07] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] overflow-hidden">
          {entries.map((entry) => {
            const item = catalog.find((m) => m.id === entry.mediaId);
            if (!item) return null;
            const checked = selectedIds.includes(item.id);
            const dateStr = new Date(entry.watchedAtIso).toLocaleDateString('zh-CN', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {manageMode && (
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSelect(item.id)}
                      aria-label={`选择 ${item.title}`}
                      className="h-4 w-4 rounded accent-[#E5A93C] shrink-0"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => onPlayMedia(item, entry.episode, entry.sourceName)}
                    aria-label={`继续播放 ${item.title}`}
                    className="relative aspect-video w-32 sm:w-36 shrink-0 overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
                  >
                    <PosterArtwork item={item} variant="landscape" className="h-full w-full" />
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-[#E5A93C]"
                        style={{ width: `${Math.max(4, entry.progressPercent)}%` }}
                      />
                    </div>
                  </button>

                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => onPlayMedia(item, entry.episode, entry.sourceName)}
                      className="text-left text-base font-semibold text-[#14161A] dark:text-[#F4F2ED] hover:text-amber-700 dark:hover:text-amber-300 truncate block"
                    >
                      {item.title}
                    </button>
                    <p className="mt-1 text-xs text-[#5D6470] dark:text-[#8F96A3] font-mono-tabular">
                      第 {entry.episode}/{item.episodesCount} 集 · {item.year} · {entry.sourceName}
                    </p>
                    <p className="mt-1 text-xs text-[#6B7280] dark:text-[#7F8794] font-mono-tabular">
                      已观看 {entry.progressPercent}% · {dateStr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onPlayMedia(item, entry.episode, entry.sourceName)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#14161A] dark:bg-[#E5A93C] px-4 py-2 text-xs font-semibold text-white dark:text-[#0A0B0E] hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                    <span>继续播放</span>
                  </button>
                  {manageMode && (
                    <button
                      type="button"
                      onClick={() => onDeleteHistoryItems([item.id])}
                      aria-label={`删除 ${item.title} 历史记录`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/[0.08] dark:border-white/[0.08] pb-5">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#14161A] dark:text-[#F4F2ED]">
            播放历史
          </h1>
          <p className="mt-1 text-sm text-[#5D6470] dark:text-[#8F96A3] font-mono-tabular">
            从上次停下的进度继续观看 · 共 {history.length} 条记录
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {manageMode && selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onDeleteHistoryItems(selectedIds);
                setSelectedIds([]);
              }}
              className="rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-700 whitespace-nowrap"
            >
              删除所选 ({selectedIds.length})
            </button>
          )}
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setManageMode((m) => !m);
                setSelectedIds([]);
              }}
              className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] px-3.5 py-2 text-xs font-medium text-[#14161A] dark:text-[#F4F2ED] whitespace-nowrap"
            >
              {manageMode ? '完成管理' : '管理记录'}
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] p-14 text-center">
          <History className="mx-auto h-8 w-8 text-[#8F96A3]" aria-hidden="true" />
          <p className="mt-3 text-base font-medium text-[#14161A] dark:text-[#F4F2ED]">
            播放历史已清空
          </p>
          <p className="mt-1 text-xs text-[#5D6470] dark:text-[#8F96A3]">
            播放任意影片或剧集后，进度会自动保存在这里。
          </p>
          <button
            type="button"
            onClick={onBackHome}
            className="mt-5 inline-flex items-center rounded-lg bg-[#14161A] dark:bg-[#E5A93C] px-4 py-2 text-xs font-semibold text-white dark:text-[#0A0B0E]"
          >
            返回首页挑选影片
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {renderGroup('今天', today)}
          {renderGroup('更早', earlier)}
        </div>
      )}
    </div>
  );
}
