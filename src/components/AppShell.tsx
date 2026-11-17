import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Bookmark,
  ChevronRight,
  Compass,
  History,
  Home,
  LogOut,
  MonitorPlay,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Sparkles,
  Sun,
  Tv,
  User,
} from 'lucide-react';
import type { NavSection } from '../types/media';

interface AppShellProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSubmitSearch: (mode?: 'normal' | 'ai') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  tvMode: boolean;
  onToggleTvMode: () => void;
  onOpenSettings: () => void;
  onOpenLoginPreview: () => void;
  username: string;
  favoritesCount: number;
  historyCount: number;
  children: ReactNode;
}

export function AppShell({
  activeSection,
  onNavigate,
  searchQuery,
  onSearchQueryChange,
  onSubmitSearch,
  theme,
  onToggleTheme,
  tvMode,
  onToggleTvMode,
  onOpenSettings,
  onOpenLoginPreview,
  username,
  favoritesCount,
  historyCount,
  children,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const navItems: Array<{
    id: Exclude<NavSection, 'search' | 'player' | 'login'>;
    label: string;
    icon: typeof Home;
    count?: number;
  }> = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'discover', label: '发现', icon: Compass },
    { id: 'favorites', label: '收藏夹', icon: Bookmark, count: favoritesCount },
    { id: 'history', label: '播放历史', icon: History, count: historyCount },
  ];

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmitSearch('normal');
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F7F6F2] text-[#14161A] dark:bg-[#0A0B0E] dark:text-[#F4F2ED] transition-colors duration-200 ${
        tvMode ? 'tv-mode text-[17px]' : ''
      }`}
    >
      {/* Top Bar: Clean Single-Row Studio Navigation */}
      <header className="sticky top-0 z-40 h-16 border-b border-black/[0.07] dark:border-white/[0.08] bg-[#F7F6F2]/92 dark:bg-[#0A0B0E]/92 backdrop-blur-md">
        <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2.5 sm:gap-4 lg:gap-8">
          {/* Brand Zone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label={sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#5D6470] dark:text-[#8F96A3] hover:bg-black/5 dark:hover:bg-white/6 hover:text-[#14161A] dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4.5 w-4.5" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="h-4.5 w-4.5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md px-0.5 py-0.5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#14161A] dark:bg-[#E5A93C] text-[#F4F2ED] dark:text-[#0A0B0E]">
                <MonitorPlay className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap">
                ReelFind
              </span>
            </button>
          </div>

          {/* Center Search Bar */}
          <form
            role="search"
            aria-label="全站搜索"
            onSubmit={handleFormSubmit}
            className="flex-1 min-w-0 max-w-xl"
          >
            <div className="relative flex items-center">
              <Search
                className="pointer-events-none absolute left-3 h-4 w-4 text-[#5D6470] dark:text-[#8F96A3]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                aria-label="搜索影片、电视剧、综艺"
                placeholder="搜索影片、剧集、演员…"
                className="h-9 sm:h-10 w-full min-w-0 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] pl-9 pr-10 sm:pr-28 text-xs sm:text-sm text-[#14161A] dark:text-[#F4F2ED] placeholder:text-[#7E8591] dark:placeholder:text-[#747B88] focus:border-amber-600 dark:focus:border-amber-400 focus:outline-none transition-colors"
              />
              <div className="absolute right-1 sm:right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onSubmitSearch('ai')}
                  aria-label="AI 找片"
                  title="AI 找片"
                  className="inline-flex items-center gap-1 rounded-md px-1.5 sm:px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-colors whitespace-nowrap shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">AI 找片</span>
                </button>
                <button
                  type="submit"
                  aria-label="提交搜索"
                  className="hidden sm:inline-flex h-7 items-center justify-center rounded-md bg-[#14161A] dark:bg-[#E5A93C] px-2.5 text-xs font-medium text-white dark:text-[#0A0B0E] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                >
                  搜索
                </button>
              </div>
            </div>
          </form>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2 shrink-0 relative">
            <button
              type="button"
              onClick={onToggleTvMode}
              aria-pressed={tvMode}
              aria-label={tvMode ? '退出电视模式' : '进入电视模式'}
              className={`hidden sm:inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                tvMode
                  ? 'border-amber-500/60 bg-amber-500/15 text-amber-800 dark:text-amber-300'
                  : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] text-[#4B525E] dark:text-[#B3B9C4] hover:border-black/20 dark:hover:border-white/20'
              }`}
            >
              <Tv className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{tvMode ? '电视模式已开' : '电视模式'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? '切换为浅色外观' : '切换为深色外观'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] text-[#4B525E] dark:text-[#B3B9C4] hover:border-black/20 dark:hover:border-white/20 transition-colors shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              aria-expanded={accountOpen}
              aria-label="账号菜单"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B] px-2.5 text-xs font-medium text-[#14161A] dark:text-[#F4F2ED] hover:border-black/20 dark:hover:border-white/20 transition-colors whitespace-nowrap shrink-0"
            >
              <User className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span className="hidden lg:inline">{username}</span>
            </button>

            {accountOpen && (
              <div
                role="menu"
                aria-label="账号快捷操作"
                className="absolute right-0 top-12 w-56 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#151821] p-1.5 shadow-xl z-50"
              >
                <div className="px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.07]">
                  <p className="text-xs font-semibold text-[#14161A] dark:text-[#F4F2ED]">{username}</p>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#8F96A3] mt-0.5">
                    私人放映厅会员 · 30 天免登录
                  </p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountOpen(false);
                    onOpenSettings();
                  }}
                  className="mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-[#2C313A] dark:text-[#D7DCE5] hover:bg-black/5 dark:hover:bg-white/6 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="h-3.5 w-3.5" aria-hidden="true" />
                    设置与外观
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountOpen(false);
                    onOpenLoginPreview();
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                    查看重设计登录页
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace: Collapsible Sidebar Rail + Viewport */}
      <div className="flex flex-1 min-h-0">
        <aside
          aria-label="主导航栏"
          className={`hidden md:flex flex-col justify-between shrink-0 border-r border-black/[0.07] dark:border-white/[0.08] bg-[#F2F0EB]/65 dark:bg-[#0D0F14] transition-all duration-200 ${
            sidebarCollapsed ? 'w-[72px]' : 'w-[224px]'
          }`}
        >
          <nav aria-label="主导航" className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#14161A] text-white dark:bg-[#E5A93C] dark:text-[#0A0B0E]'
                      : 'text-[#4B525E] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/[0.06] hover:text-[#14161A] dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </span>
                  {!sidebarCollapsed && typeof item.count === 'number' && (
                    <span
                      className={`font-mono-tabular text-xs ${
                        isActive
                          ? 'text-white/80 dark:text-[#0A0B0E]/80'
                          : 'text-[#7E8591] dark:text-[#6B7280]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.07] space-y-1">
            <button
              type="button"
              onClick={onOpenSettings}
              title={sidebarCollapsed ? '设置' : undefined}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#4B525E] dark:text-[#9CA3AF] hover:bg-black/5 dark:hover:bg-white/[0.06] hover:text-[#14161A] dark:hover:text-white transition-colors whitespace-nowrap"
            >
              <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!sidebarCollapsed && <span>设置</span>}
            </button>
          </div>
        </aside>

        {/* Content Scroll Container */}
        <main className="flex-1 min-w-0 pb-20 md:pb-12">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Compact, <= 64px height, 44px+ touch targets) */}
      <nav
        aria-label="移动端主导航"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 border-t border-black/10 dark:border-white/10 bg-[#F7F6F2]/95 dark:bg-[#0D0F14]/95 backdrop-blur-md grid grid-cols-5 px-1"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 min-h-[44px] text-[11px] font-medium whitespace-nowrap ${
                isActive
                  ? 'text-amber-700 dark:text-[#E5A93C]'
                  : 'text-[#5D6470] dark:text-[#8F96A3]'
              }`}
            >
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center gap-1 min-h-[44px] text-[11px] font-medium text-[#5D6470] dark:text-[#8F96A3] whitespace-nowrap"
        >
          <Settings className="h-4.5 w-4.5" aria-hidden="true" />
          <span>设置</span>
        </button>
      </nav>
    </div>
  );
}
