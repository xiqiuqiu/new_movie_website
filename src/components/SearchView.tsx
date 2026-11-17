import { useState, type FormEvent } from 'react';
import { ChevronDown, ChevronUp, Play, Search, Sparkles } from 'lucide-react';
import type { MediaItem, MediaKind, SearchMode } from '../types/media';
import { aiMatchCatalog, searchCatalog } from '../utils/catalogLogic';
import { PosterArtwork } from './PosterArtwork';

interface SearchViewProps {
  catalog: MediaItem[];
  query: string;
  onQueryChange: (q: string) => void;
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  aggregateSources: boolean;
  onToggleAggregate: () => void;
  onPlayMedia: (item: MediaItem, episode?: number, sourceName?: string) => void;
}

const SAMPLE_AI_CLUES = [
  '东北 律师 喜剧',
  '1948 谍战 历史 高分',
  '70mm 史诗 冒险',
  '轻松治愈 农场 真人秀',
];

export function SearchView({
  catalog,
  query,
  onQueryChange,
  mode,
  onModeChange,
  aggregateSources,
  onToggleAggregate,
  onPlayMedia,
}: SearchViewProps) {
  const [kindFilter, setKindFilter] = useState<MediaKind | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiClue, setAiClue] = useState(query || '东北 律师 喜剧');
  const [submittedAiClue, setSubmittedAiClue] = useState(query || '东北 律师 喜剧');

  const { results, countsByKind } = searchCatalog(
    catalog,
    query,
    kindFilter,
    aggregateSources
  );

  const aiMatches = aiMatchCatalog(catalog, submittedAiClue);

  const handleAiSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedAiClue(aiClue);
  };

  return (
    <div className="space-y-7">
      {/* Header & Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/[0.08] dark:border-white/[0.08] pb-5">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#14161A] dark:text-[#F4F2ED]">
            {mode === 'normal' ? '全站聚合搜索' : 'AI 线索找片'}
          </h1>
          <p className="mt-1 text-sm text-[#5D6470] dark:text-[#8F96A3]">
            {mode === 'normal'
              ? query.trim()
                ? `当前关键词：${query.trim()} · 自动聚合多线路播放源`
                : '按片名、导演、演员或年份检索全站片源'
              : '用自然语言描述剧情、年代、地域或观影氛围，精准定位候选影片'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {mode === 'normal' && (
            <button
              type="button"
              role="switch"
              aria-checked={aggregateSources}
              onClick={onToggleAggregate}
              className="inline-flex items-center gap-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] px-3 py-1.5 text-xs font-medium text-[#14161A] dark:text-[#F4F2ED] whitespace-nowrap"
            >
              <span>聚合线路</span>
              <span
                aria-hidden="true"
                className={`inline-flex h-4.5 w-8 items-center rounded-full p-0.5 transition-colors ${
                  aggregateSources ? 'bg-[#E5A93C]' : 'bg-black/20 dark:bg-white/20'
                }`}
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                    aggregateSources ? 'translate-x-3.5' : 'translate-x-0'
                  }`}
                />
              </span>
            </button>
          )}

          <div
            role="tablist"
            aria-label="搜索模式"
            className="inline-flex items-center gap-1 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'normal'}
              onClick={() => onModeChange('normal')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                mode === 'normal'
                  ? 'bg-[#14161A] text-white dark:bg-[#E5A93C] dark:text-[#0A0B0E]'
                  : 'text-[#5D6470] dark:text-[#9CA3AF] hover:text-[#14161A] dark:hover:text-white'
              }`}
            >
              普通搜索
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'ai'}
              onClick={() => onModeChange('ai')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                mode === 'ai'
                  ? 'bg-[#14161A] text-white dark:bg-[#E5A93C] dark:text-[#0A0B0E]'
                  : 'text-[#5D6470] dark:text-[#9CA3AF] hover:text-[#14161A] dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>AI 找片</span>
            </button>
          </div>
        </div>
      </div>

      {mode === 'normal' ? (
        <div className="space-y-6">
          {/* Kind Filter Bar + AI Handoff Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="结果分类筛选">
              {(
                [
                  { id: 'all', label: '全部', count: countsByKind.all },
                  { id: 'movie', label: '电影', count: countsByKind.movie },
                  { id: 'series', label: '剧集', count: countsByKind.series },
                  { id: 'variety', label: '综艺', count: countsByKind.variety },
                ] as const
              ).map((tab) => {
                const active = kindFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setKindFilter(tab.id)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium border transition-colors whitespace-nowrap font-mono-tabular ${
                      active
                        ? 'border-amber-600/60 dark:border-amber-400/60 bg-amber-500/12 text-amber-800 dark:text-amber-300'
                        : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] text-[#4B525E] dark:text-[#9CA3AF] hover:border-black/20 dark:hover:border-white/20'
                    }`}
                  >
                    {tab.label} {tab.count}
                  </button>
                );
              })}
            </div>

            {query.trim() && (
              <button
                type="button"
                onClick={() => {
                  setAiClue(query);
                  setSubmittedAiClue(query);
                  onModeChange('ai');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline self-start md:self-auto whitespace-nowrap"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>用 AI 按剧情线索进一步筛选「{query.trim()}」</span>
              </button>
            )}
          </div>

          {/* Search Results List */}
          {results.length === 0 ? (
            <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] p-12 text-center">
              <Search className="mx-auto h-7 w-7 text-[#8F96A3]" aria-hidden="true" />
              <p className="mt-3 text-base font-medium text-[#14161A] dark:text-[#F4F2ED]">
                未找到与「{query}」匹配的影片
              </p>
              <p className="mt-1 text-xs text-[#5D6470] dark:text-[#8F96A3]">
                可以清空关键词浏览全库，或切换到「AI 找片」用剧情片段搜索。
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onQueryChange('')}
                  className="rounded-lg border border-black/10 dark:border-white/10 px-4 py-2 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5"
                >
                  查看全部片库
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiClue(query);
                    setSubmittedAiClue(query);
                    onModeChange('ai');
                  }}
                  className="rounded-lg bg-[#14161A] dark:bg-[#E5A93C] px-4 py-2 text-xs font-semibold text-white dark:text-[#0A0B0E]"
                >
                  转到 AI 找片
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {results.map(({ item, totalSourceHits }, index) => {
                const rowKey = `${item.id}-${index}`;
                const isExpanded = expandedId === rowKey;
                const primarySource = item.sources[0];

                return (
                  <article
                    key={rowKey}
                    className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] p-4 transition-colors hover:border-amber-600/40 dark:hover:border-amber-400/40"
                  >
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => onPlayMedia(item, 1, primarySource?.name)}
                        aria-label={`打开 ${item.title}`}
                        className="group relative h-36 w-26 shrink-0 overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
                      >
                        <PosterArtwork item={item} variant="poster" className="h-full w-full" />
                      </button>

                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-baseline justify-between gap-3">
                            <button
                              type="button"
                              onClick={() => onPlayMedia(item, 1, primarySource?.name)}
                              className="text-left text-base font-semibold text-[#14161A] dark:text-[#F4F2ED] hover:text-amber-700 dark:hover:text-amber-300 truncate"
                            >
                              {item.title}
                            </button>
                            {item.rating !== null && (
                              <span className="font-mono-tabular text-xs font-semibold text-amber-700 dark:text-[#E5A93C] shrink-0">
                                豆瓣 {item.rating.toFixed(1)}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-[#5D6470] dark:text-[#8F96A3] font-mono-tabular truncate">
                            {item.genreLabel} · {item.year} ·{' '}
                            {item.episodesCount > 1 ? `共 ${item.episodesCount} 集` : `${item.durationMinutes} 分钟`}
                            {' · '}
                            {aggregateSources
                              ? `${totalSourceHits} 个可用来源`
                              : primarySource?.name}
                          </p>

                          <p className="mt-2 text-xs leading-relaxed text-[#4B525E] dark:text-[#B3B9C4] line-clamp-2">
                            {item.synopsis}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onPlayMedia(item, 1, primarySource?.name)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#14161A] dark:bg-[#E5A93C] px-3.5 py-1.5 text-xs font-semibold text-white dark:text-[#0A0B0E] hover:opacity-90 transition-opacity whitespace-nowrap"
                          >
                            <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                            <span>立即播放</span>
                          </button>

                          {item.sources.length > 1 && (
                            <button
                              type="button"
                              aria-expanded={isExpanded}
                              onClick={() => setExpandedId(isExpanded ? null : rowKey)}
                              className="inline-flex items-center gap-1 rounded-lg border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs font-medium text-[#4B525E] dark:text-[#B3B9C4] hover:border-black/25 dark:hover:border-white/25 whitespace-nowrap"
                            >
                              <span>{isExpanded ? '收起线路' : `选择线路 (${item.sources.length})`}</span>
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Inline Expandable Sources Table */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.07] grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.sources.map((src) => (
                          <button
                            key={src.id}
                            type="button"
                            onClick={() => onPlayMedia(item, 1, src.name)}
                            className="flex items-center justify-between rounded-lg border border-black/[0.07] dark:border-white/[0.08] bg-[#F7F6F2] dark:bg-[#0D0F14] px-3 py-2 text-left text-xs hover:border-amber-500/60 transition-colors"
                          >
                            <span className="font-medium text-[#14161A] dark:text-[#F4F2ED]">
                              {src.name}
                            </span>
                            <span className="font-mono-tabular text-[11px] text-[#5D6470] dark:text-[#8F96A3]">
                              {src.quality} · {src.latencyLabel}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Refined AI 找片 Workspace */
        <div className="space-y-6">
          <form
            onSubmit={handleAiSubmit}
            className="rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] p-5 sm:p-6 space-y-4"
          >
            <label htmlFor="ai-clue-input" className="block text-sm font-medium text-[#14161A] dark:text-[#F4F2ED]">
              输入剧情线索、人物设定或想看的观影风格
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="ai-clue-input"
                type="text"
                value={aiClue}
                onChange={(e) => setAiClue(e.target.value)}
                placeholder="例如：东北律师街头律所喜剧、或者 1948 年北平谍战高分剧"
                className="h-11 flex-1 rounded-lg border border-black/10 dark:border-white/10 bg-[#F7F6F2] dark:bg-[#0A0B0E] px-4 text-sm text-[#14161A] dark:text-[#F4F2ED] placeholder:text-[#7E8591] focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#14161A] dark:bg-[#E5A93C] px-5 text-sm font-semibold text-white dark:text-[#0A0B0E] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>开始匹配</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-[#5D6470] dark:text-[#8F96A3]">试试这些线索：</span>
              {SAMPLE_AI_CLUES.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => {
                    setAiClue(sample);
                    setSubmittedAiClue(sample);
                  }}
                  className="rounded-md border border-black/10 dark:border-white/10 px-2.5 py-1 text-xs text-[#4B525E] dark:text-[#B3B9C4] hover:border-amber-500/60 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                >
                  {sample}
                </button>
              ))}
            </div>
          </form>

          {aiMatches.length === 0 ? (
            <div className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] p-10 text-center">
              <p className="text-sm font-medium">没有找到贴合「{submittedAiClue}」的片目</p>
              <p className="mt-1 text-xs text-[#5D6470] dark:text-[#8F96A3]">
                尝试减少限定词，或点击上方示例线索。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiMatches.map(({ item, reason }) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#13151B] p-4"
                >
                  <button
                    type="button"
                    onClick={() => onPlayMedia(item)}
                    aria-label={`播放 ${item.title}`}
                    className="h-36 w-26 shrink-0 overflow-hidden rounded-lg border border-black/10 dark:border-white/10"
                  >
                    <PosterArtwork item={item} variant="poster" className="h-full w-full" />
                  </button>
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300 truncate">
                        匹配依据：{reason}
                      </p>
                      <div className="mt-1 flex items-baseline justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onPlayMedia(item)}
                          className="text-left text-base font-semibold text-[#14161A] dark:text-[#F4F2ED] hover:text-amber-700 dark:hover:text-amber-300 truncate"
                        >
                          {item.title}
                        </button>
                        {item.rating && (
                          <span className="font-mono-tabular text-xs font-semibold text-amber-700 dark:text-[#E5A93C] shrink-0">
                            {item.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-[#5D6470] dark:text-[#8F96A3] line-clamp-2">
                        {item.synopsis}
                      </p>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => onPlayMedia(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#14161A] dark:bg-[#E5A93C] px-3.5 py-1.5 text-xs font-semibold text-white dark:text-[#0A0B0E]"
                      >
                        <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                        <span>立即播放</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
