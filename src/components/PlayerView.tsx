import { useEffect, useState } from 'react';
import {
  ArrowDownUp,
  ArrowLeft,
  Bookmark,
  Captions,
  ChevronRight,
  ExternalLink,
  Lightbulb,
  Maximize2,
  Pause,
  Play,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { MediaItem } from '../types/media';
import { computeEpisodeChunks, formatTimecode } from '../utils/catalogLogic';
import { PosterArtwork } from './PosterArtwork';

interface PlayerViewProps {
  item: MediaItem;
  episode: number;
  sourceName: string;
  initialPositionSeconds: number;
  isFavorite: boolean;
  tvMode: boolean;
  relatedItems: MediaItem[];
  onBack: () => void;
  onSelectEpisode: (episode: number) => void;
  onSelectSource: (sourceName: string) => void;
  onUpdateProgress: (episode: number, positionSeconds: number, durationSeconds: number, sourceName: string) => void;
  onToggleFavorite: (mediaId: string) => void;
  onToggleTvMode: () => void;
  onPlayRelated: (item: MediaItem) => void;
}

export function PlayerView({
  item,
  episode,
  sourceName,
  initialPositionSeconds,
  isFavorite,
  tvMode,
  relatedItems,
  onBack,
  onSelectEpisode,
  onSelectSource,
  onUpdateProgress,
  onToggleFavorite,
  onToggleTvMode,
  onPlayRelated,
}: PlayerViewProps) {
  const totalSeconds = item.durationMinutes * 60;
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSeconds, setCurrentSeconds] = useState(
    Math.min(totalSeconds - 10, Math.max(0, initialPositionSeconds))
  );
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.25 | 1.5 | 2>(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [lightsOff, setLightsOff] = useState(false);
  const [panelHidden, setPanelHidden] = useState(false);
  const [panelTab, setPanelTab] = useState<'episodes' | 'sources'>('episodes');
  const [descending, setDescending] = useState(false);

  const chunks = computeEpisodeChunks(item.episodesCount, 10, descending);
  const activeChunkIdx = Math.max(
    0,
    chunks.findIndex((c) => episode >= c.start && episode <= c.end)
  );
  const [selectedChunkIdx, setSelectedChunkIdx] = useState(activeChunkIdx);

  useEffect(() => {
    setSelectedChunkIdx(activeChunkIdx);
  }, [activeChunkIdx, item.id, descending]);

  useEffect(() => {
    setCurrentSeconds(Math.min(totalSeconds - 10, Math.max(0, initialPositionSeconds)));
    setIsPlaying(true);
  }, [item.id, episode, initialPositionSeconds, totalSeconds]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrentSeconds((prev) => {
        const next = prev + playbackRate;
        if (next >= totalSeconds) {
          setIsPlaying(false);
          return totalSeconds;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying, playbackRate, totalSeconds]);

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      onUpdateProgress(episode, currentSeconds, totalSeconds, sourceName);
    }, 500);
    return () => window.clearTimeout(syncTimer);
  }, [episode, currentSeconds, totalSeconds, sourceName, onUpdateProgress]);

  const activeChunk = chunks[selectedChunkIdx] ?? chunks[0];
  const progressRatio = totalSeconds > 0 ? Math.min(100, (currentSeconds / totalSeconds) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Cinema Lights-Off Backdrop */}
      {lightsOff && (
        <button
          type="button"
          aria-label="退出关灯模式"
          onClick={() => setLightsOff(false)}
          className="fixed inset-0 z-30 bg-black/82 transition-opacity cursor-pointer"
        />
      )}

      {/* Top Player Header */}
      <div className="relative z-40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="返回"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] hover:border-amber-500/60 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#14161A] dark:text-[#F4F2ED] truncate">
              {item.title}
            </h1>
            <p className="text-xs text-[#5D6470] dark:text-[#8F96A3] font-mono-tabular truncate">
              {item.episodesCount > 1 ? `第 ${episode} 集` : '正片'} · {sourceName} · {item.year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setLightsOff((v) => !v)}
            aria-pressed={lightsOff}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              lightsOff
                ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] text-[#4B525E] dark:text-[#B3B9C4]'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{lightsOff ? '开灯' : '关灯模式'}</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            aria-pressed={isFavorite}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              isFavorite
                ? 'border-amber-500 bg-[#E5A93C] text-[#0A0B0E] font-semibold'
                : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] text-[#14161A] dark:text-[#F4F2ED]'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
            <span>{isFavorite ? '已收藏' : '收藏'}</span>
          </button>
        </div>
      </div>

      {/* Stage + Unified Episode / Source Inspector */}
      <div className="relative z-40 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Theatre Stage */}
        <div
          className={`${
            panelHidden ? 'lg:col-span-12' : 'lg:col-span-8 xl:col-span-9'
          } rounded-2xl overflow-hidden border border-white/10 bg-[#07080B] text-white shadow-2xl`}
        >
          <div className="relative aspect-video w-full bg-black select-none">
            <img
              src={item.backdropImage ?? item.posterImage}
              alt={`${item.title} 播放画面`}
              referrerPolicy="no-referrer"
              className={`h-full w-full object-cover transition-opacity duration-300 ${
                isPlaying ? 'opacity-95' : 'opacity-70'
              }`}
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35"
              aria-hidden="true"
            />

            {/* Top Stage Status */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white/80 font-mono-tabular">
              <span>
                {sourceName} · {item.sources.find((s) => s.name === sourceName)?.quality ?? '1080P'}
              </span>
              {panelHidden && (
                <button
                  type="button"
                  onClick={() => setPanelHidden(false)}
                  className="rounded-md bg-black/60 border border-white/15 px-2.5 py-1 text-xs text-white hover:bg-black/80"
                >
                  显示选集面板
                </button>
              )}
            </div>

            {/* Center Play/Pause Tap Zone */}
            <button
              type="button"
              aria-label={isPlaying ? '暂停播放' : '继续播放'}
              onClick={() => setIsPlaying((p) => !p)}
              className="absolute inset-0 flex items-center justify-center group"
            >
              {!isPlaying && (
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#E5A93C] text-[#0A0B0E] shadow-xl transition-transform group-hover:scale-105">
                  <Play className="h-7 w-7 fill-current ml-0.5" aria-hidden="true" />
                </span>
              )}
            </button>

            {/* Cinema Subtitle Sample Overlay */}
            {showSubtitles && (
              <div className="pointer-events-none absolute bottom-16 inset-x-4 text-center">
                <span className="inline-block rounded bg-black/60 px-3 py-1 text-sm sm:text-base font-medium text-white/95 tracking-wide">
                  {item.id === 'zhengzheng-rishang'
                    ? '“这几点就喝酒啊——先把今天这单委托书理清楚再说。”'
                    : `正在播放：${item.title}${item.episodesCount > 1 ? ` 第 ${episode} 集` : ''}`}
                </span>
              </div>
            )}

            {/* Player Controls Bar */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 space-y-2.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  aria-label="播放进度"
                  min={0}
                  max={totalSeconds}
                  value={Math.floor(currentSeconds)}
                  onChange={(e) => setCurrentSeconds(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer accent-[#E5A93C]"
                />
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? '暂停' : '播放'}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
                    ) : (
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                    )}
                  </button>

                  {item.episodesCount > 1 && episode < item.episodesCount && (
                    <button
                      type="button"
                      onClick={() => onSelectEpisode(episode + 1)}
                      aria-label="下一集"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
                    >
                      <SkipForward className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? '取消静音' : '静音'}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10"
                  >
                    {muted ? (
                      <VolumeX className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Volume2 className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>

                  <span className="font-mono-tabular text-white/85">
                    {formatTimecode(currentSeconds)} / {formatTimecode(totalSeconds)}
                  </span>
                  <span className="hidden sm:inline font-mono-tabular text-amber-300">
                    ({Math.round(progressRatio)}%)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubtitles((s) => !s)}
                    aria-pressed={showSubtitles}
                    aria-label="切换字幕"
                    className={`inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs ${
                      showSubtitles ? 'text-amber-300 bg-white/10' : 'text-white/75 hover:bg-white/10'
                    }`}
                  >
                    <Captions className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">字幕</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const rates: Array<1 | 1.25 | 1.5 | 2> = [1, 1.25, 1.5, 2];
                      const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
                      setPlaybackRate(next);
                    }}
                    aria-label="切换倍速"
                    className="h-8 rounded-md px-2 font-mono-tabular text-white/85 hover:bg-white/10"
                  >
                    {playbackRate}x
                  </button>

                  <button
                    type="button"
                    onClick={() => setPanelHidden((h) => !h)}
                    aria-label={panelHidden ? '显示选集栏' : '宽屏剧院模式'}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/85 hover:bg-white/10"
                  >
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Episode & Source Inspector */}
        {!panelHidden && (
          <aside
            aria-label="选集与线路"
            className="lg:col-span-4 xl:col-span-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[#14161A] dark:text-[#F4F2ED]">
                选集与线路
              </h2>
              <button
                type="button"
                onClick={() => setPanelHidden(true)}
                className="rounded-md border border-black/10 dark:border-white/10 px-2.5 py-1 text-xs text-[#5D6470] dark:text-[#8F96A3] hover:text-[#14161A] dark:hover:text-white"
              >
                隐藏
              </button>
            </div>

            <div
              role="tablist"
              aria-label="播放器侧栏切换"
              className="grid grid-cols-2 border-b border-black/[0.08] dark:border-white/[0.08]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={panelTab === 'episodes'}
                onClick={() => setPanelTab('episodes')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  panelTab === 'episodes'
                    ? 'border-[#E5A93C] text-[#14161A] dark:text-[#F4F2ED]'
                    : 'border-transparent text-[#5D6470] dark:text-[#8F96A3]'
                }`}
              >
                选集 ({item.episodesCount})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={panelTab === 'sources'}
                onClick={() => setPanelTab('sources')}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  panelTab === 'sources'
                    ? 'border-[#E5A93C] text-[#14161A] dark:text-[#F4F2ED]'
                    : 'border-transparent text-[#5D6470] dark:text-[#8F96A3]'
                }`}
              >
                线路 ({item.sources.length})
              </button>
            </div>

            {panelTab === 'episodes' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {chunks.map((chunk, idx) => {
                      const active = idx === selectedChunkIdx;
                      return (
                        <button
                          key={chunk.label}
                          type="button"
                          onClick={() => setSelectedChunkIdx(idx)}
                          className={`rounded-md px-2.5 py-1 font-mono-tabular text-xs border transition-colors whitespace-nowrap ${
                            active
                              ? 'border-amber-600/60 dark:border-amber-400/60 bg-amber-500/12 text-amber-800 dark:text-amber-300 font-semibold'
                              : 'border-black/10 dark:border-white/10 text-[#5D6470] dark:text-[#8F96A3]'
                          }`}
                        >
                          {chunk.label}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDescending((d) => !d)}
                    aria-label={descending ? '切换为正序' : '切换为倒序'}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 dark:border-white/10 text-[#5D6470] dark:text-[#8F96A3] hover:text-[#14161A] dark:hover:text-white shrink-0"
                  >
                    <ArrowDownUp className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {activeChunk?.episodes.map((ep) => {
                    const isCurrent = ep === episode;
                    return (
                      <button
                        key={ep}
                        type="button"
                        onClick={() => onSelectEpisode(ep)}
                        aria-current={isCurrent ? 'true' : undefined}
                        className={`h-10 rounded-lg border font-mono-tabular text-xs font-semibold transition-colors ${
                          isCurrent
                            ? 'border-[#E5A93C] bg-[#E5A93C] text-[#0A0B0E]'
                            : 'border-black/10 dark:border-white/10 bg-[#F7F6F2] dark:bg-[#0D0F14] text-[#14161A] dark:text-[#F4F2ED] hover:border-amber-500/50'
                        }`}
                      >
                        {ep}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {item.sources.map((src) => {
                  const active = src.name === sourceName;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => onSelectSource(src.name)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${
                        active
                          ? 'border-[#E5A93C] bg-amber-500/10'
                          : 'border-black/10 dark:border-white/10 bg-[#F7F6F2] dark:bg-[#0D0F14] hover:border-amber-500/40'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-[#14161A] dark:text-[#F4F2ED]">
                          {src.name}
                        </p>
                        <p className="mt-0.5 font-mono-tabular text-[11px] text-[#5D6470] dark:text-[#8F96A3]">
                          {src.quality} · {src.episodesAvailable} 集全
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
                        {active ? '当前线路' : src.latencyLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Film Editorial Dossier */}
      <section
        aria-label="影片详情"
        className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="h-48 w-34 shrink-0 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <PosterArtwork item={item} variant="poster" className="h-full w-full" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#14161A] dark:text-[#F4F2ED]">
                  {item.title}
                </h2>
                <p className="mt-1 text-xs text-[#5D6470] dark:text-[#8F96A3] font-mono-tabular">
                  {item.genreLabel} · {item.year} · {item.directorOrHost} · 主演：
                  {item.cast.join(' / ')}
                </p>
              </div>
              <a
                href={item.doubanUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline whitespace-nowrap"
              >
                <span>豆瓣条目参考</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.07]">
              <h3 className="text-xs font-semibold text-[#14161A] dark:text-[#F4F2ED]">剧情简介</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#4B525E] dark:text-[#B3B9C4]">
                {item.synopsis}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Recommendations */}
      <section aria-label="相关推荐">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#14161A] dark:text-[#F4F2ED]">相关推荐</h2>
          <span className="inline-flex items-center gap-1 text-xs text-[#5D6470] dark:text-[#8F96A3]">
            横向浏览 <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {relatedItems.map((rel) => (
            <article key={rel.id} className="group flex flex-col">
              <button
                type="button"
                onClick={() => onPlayRelated(rel)}
                className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-black/[0.08] dark:border-white/[0.08] text-left"
              >
                <PosterArtwork item={rel} variant="poster" className="h-full w-full" />
              </button>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onPlayRelated(rel)}
                  className="text-left text-sm font-medium text-[#14161A] dark:text-[#F4F2ED] hover:text-amber-700 dark:hover:text-amber-300 truncate"
                >
                  {rel.title}
                </button>
                {rel.rating && (
                  <span className="font-mono-tabular text-xs font-semibold text-amber-700 dark:text-[#E5A93C] shrink-0">
                    {rel.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
