import { useState } from 'react';
import { MonitorPlay, Moon, Palette, Shield, Sun, Tv, User, X } from 'lucide-react';
import type { UserPreferences } from '../types/media';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  prefs: UserPreferences;
  onUpdatePrefs: (next: UserPreferences) => void;
  username: string;
  onOpenLoginPreview: () => void;
}

export function SettingsModal({
  open,
  onClose,
  prefs,
  onUpdatePrefs,
  username,
  onOpenLoginPreview,
}: SettingsModalProps) {
  const [tab, setTab] = useState<'appearance' | 'playback' | 'account'>('appearance');

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-[#F7F6F2] dark:bg-[#13151B] text-[#14161A] dark:text-[#F4F2ED] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/[0.08] dark:border-white/[0.08] px-6 py-4">
          <h2 id="settings-modal-title" className="text-lg font-semibold">
            设置与账号
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭设置与账号"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5D6470] dark:text-[#8F96A3] hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px]">
          <nav
            aria-label="设置分类"
            className="md:col-span-4 border-b md:border-b-0 md:border-r border-black/[0.08] dark:border-white/[0.08] bg-[#F1EFEA] dark:bg-[#0D0F14] p-3 space-y-1"
          >
            <p className="px-3 py-1.5 text-xs font-medium text-[#6B7280] dark:text-[#8F96A3]">
              个人设置
            </p>
            {[
              { id: 'appearance', label: '外观与设备', icon: Palette },
              { id: 'playback', label: '观看与收藏', icon: MonitorPlay },
              { id: 'account', label: '账号与安全', icon: Shield },
            ].map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTab(item.id as typeof tab)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    active
                      ? 'bg-white dark:bg-[#1A1D26] text-[#14161A] dark:text-white shadow-sm'
                      : 'text-[#4B525E] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="md:col-span-8 p-6 space-y-5">
            {tab === 'appearance' && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold">外观与设备</h3>

                <div className="flex items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.07] pb-4">
                  <div>
                    <p className="text-sm font-medium">界面主题</p>
                    <p className="text-xs text-[#5D6470] dark:text-[#8F96A3] mt-0.5">
                      默认推荐暗黑放映厅模式，切换后立即生效
                    </p>
                  </div>
                  <div className="inline-flex rounded-lg border border-black/10 dark:border-white/10 p-1 bg-white dark:bg-[#0A0B0E]">
                    <button
                      type="button"
                      aria-pressed={prefs.theme === 'light'}
                      onClick={() => onUpdatePrefs({ ...prefs, theme: 'light' })}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        prefs.theme === 'light'
                          ? 'bg-[#14161A] text-white'
                          : 'text-[#5D6470] dark:text-[#9CA3AF]'
                      }`}
                    >
                      <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>浅色</span>
                    </button>
                    <button
                      type="button"
                      aria-pressed={prefs.theme === 'dark'}
                      onClick={() => onUpdatePrefs({ ...prefs, theme: 'dark' })}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        prefs.theme === 'dark'
                          ? 'bg-[#E5A93C] text-[#0A0B0E] font-semibold'
                          : 'text-[#5D6470] dark:text-[#9CA3AF]'
                      }`}
                    >
                      <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>深色</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">电视大屏模式 (TV Mode)</p>
                    <p className="text-xs text-[#5D6470] dark:text-[#8F96A3] mt-0.5">
                      放大字号并强化方向键焦点高亮框，适配客厅遥控器操作
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs.tvMode}
                    onClick={() => onUpdatePrefs({ ...prefs, tvMode: !prefs.tvMode })}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                      prefs.tvMode
                        ? 'border-amber-500 bg-[#E5A93C] text-[#0A0B0E] font-semibold'
                        : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#0A0B0E]'
                    }`}
                  >
                    <Tv className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{prefs.tvMode ? '已开启' : '开启电视模式'}</span>
                  </button>
                </div>
              </div>
            )}

            {tab === 'playback' && (
              <div className="space-y-4">
                <h3 className="text-base font-semibold">观看与收藏偏好</h3>

                {[
                  {
                    key: 'autoPlayNext' as const,
                    label: '自动连播下一集',
                    desc: '当前剧集结束时自动切换到下一集并续播',
                  },
                  {
                    key: 'skipIntroOutro' as const,
                    label: '智能跳过片头片尾',
                    desc: '检测剧集常见片头时长并自动快进至正片',
                  },
                  {
                    key: 'aggregateSearch' as const,
                    label: '搜索默认聚合多来源',
                    desc: '将同一部影片的不同资源线路合并展示',
                  },
                ].map((opt) => (
                  <div
                    key={opt.key}
                    className="flex items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/[0.07] pb-3.5 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-[#5D6470] dark:text-[#8F96A3] mt-0.5">{opt.desc}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={prefs[opt.key]}
                      onClick={() => onUpdatePrefs({ ...prefs, [opt.key]: !prefs[opt.key] })}
                      className={`h-6 w-11 rounded-full p-0.5 transition-colors shrink-0 ${
                        prefs[opt.key] ? 'bg-[#E5A93C]' : 'bg-black/20 dark:bg-white/20'
                      }`}
                    >
                      <span
                        className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                          prefs[opt.key] ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'account' && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold">账号与安全</h3>
                <div className="flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0D0F14] p-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#E5A93C]/20 text-amber-700 dark:text-[#E5A93C]">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{username}</p>
                    <p className="text-xs text-[#5D6470] dark:text-[#8F96A3]">
                      已启用 30 天设备会话保持 · 站点 ReelFind / KatelyaTV
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLoginPreview();
                    }}
                    className="rounded-lg border border-amber-600/40 dark:border-amber-400/40 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
                  >
                    预览重设计后的登录页
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
