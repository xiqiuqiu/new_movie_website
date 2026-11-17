import { useState, type FormEvent } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, MonitorPlay, Moon, Sun, Ticket, Tv, User } from 'lucide-react';
import { GENERATED_ASSETS } from '../data/catalog';

interface LoginPreviewViewProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  tvMode: boolean;
  onToggleTvMode: () => void;
  onSignInSuccess: (username: string) => void;
  onReturnToApp: () => void;
}

export function LoginPreviewView({
  theme,
  onToggleTheme,
  tvMode,
  onToggleTvMode,
  onSignInSuccess,
  onReturnToApp,
}: LoginPreviewViewProps) {
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('grok-bot');
  const [password, setPassword] = useState('grokbot123');
  const [inviteCode, setInviteCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember30Days, setRemember30Days] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('请输入用户名和访问密码');
      return;
    }
    if (authTab === 'register' && !inviteCode.trim()) {
      setErrorMsg('注册新账号需要填写邀请码');
      return;
    }
    setErrorMsg('');
    onSignInSuccess(username.trim());
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F7F6F2] text-[#14161A] dark:bg-[#08090C] dark:text-[#F4F2ED] ${
        tvMode ? 'tv-mode' : ''
      }`}
    >
      {/* Top Bar */}
      <header className="h-16 border-b border-black/[0.07] dark:border-white/[0.08] px-5 sm:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReturnToApp}
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 px-3 py-1.5 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 whitespace-nowrap"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>返回放映厅</span>
          </button>
          <span className="inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight whitespace-nowrap">
            <MonitorPlay className="h-5 w-5 text-amber-600 dark:text-[#E5A93C]" aria-hidden="true" />
            <span>KatelyaTV · ReelFind</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleTvMode}
            aria-pressed={tvMode}
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium whitespace-nowrap ${
              tvMode
                ? 'border-amber-500/60 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                : 'border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B]'
            }`}
          >
            <Tv className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{tvMode ? '退出电视模式' : '电视模式'}</span>
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? '切换为浅色外观' : '切换为深色外观'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#13151B]"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Full-Viewport Editorial Split Layout */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#12141A] grid lg:grid-cols-12 items-stretch shadow-2xl">
          {/* Left Atmospheric Cinema Frame */}
          <div className="relative lg:col-span-6 min-h-[260px] lg:min-h-[540px] bg-[#0B0D12] text-white flex flex-col justify-between p-8 sm:p-10">
            <img
              src={GENERATED_ASSETS.courthouse}
              alt="私人放映厅街景剧照"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover opacity-55"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/55 to-[#08090C]/45"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-amber-300 font-mono-tabular">
                KATELYATV · PRIVATE SCREENING
              </p>
              <h2 className="font-display mt-3 text-3xl sm:text-4xl font-bold leading-tight [text-wrap:balance]">
                你的私人放映厅
              </h2>
              <p className="mt-3 text-sm text-white/75 max-w-sm leading-relaxed">
                找一部想看的，接着上次的进度。支持多线路聚合搜索、AI 线索找片与客厅电视模式。
              </p>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-white/70 font-mono-tabular">
              <span>4K HDR 多线路聚合</span>
              <span>跨设备同步进度</span>
            </div>
          </div>

          {/* Right Authentication Form */}
          <div className="lg:col-span-6 p-7 sm:p-10 flex flex-col justify-center">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#14161A] dark:text-[#F4F2ED]">
                {authTab === 'login' ? '欢迎回来' : '创建账号'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-[#5D6470] dark:text-[#8F96A3]">
                {authTab === 'login'
                  ? '登录后继续你的观影旅程'
                  : '完成邀请码验证，加入你的私人放映厅'}
              </p>
            </div>

            <div
              role="tablist"
              aria-label="认证模式"
              className="mt-6 grid grid-cols-2 rounded-lg border border-black/10 dark:border-white/10 bg-[#F7F6F2] dark:bg-[#0A0B0E] p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={authTab === 'login'}
                onClick={() => {
                  setAuthTab('login');
                  setErrorMsg('');
                }}
                className={`rounded-md py-2 text-xs font-semibold transition-colors ${
                  authTab === 'login'
                    ? 'bg-white dark:bg-[#1A1D26] text-[#14161A] dark:text-white shadow-sm'
                    : 'text-[#5D6470] dark:text-[#8F96A3]'
                }`}
              >
                登录
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={authTab === 'register'}
                onClick={() => {
                  setAuthTab('register');
                  setErrorMsg('');
                }}
                className={`rounded-md py-2 text-xs font-semibold transition-colors ${
                  authTab === 'register'
                    ? 'bg-white dark:bg-[#1A1D26] text-[#14161A] dark:text-white shadow-sm'
                    : 'text-[#5D6470] dark:text-[#8F96A3]'
                }`}
              >
                注册
              </button>
            </div>

            {tvMode && (
              <p className="mt-4 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                方向键选择输入框，确认键开始输入；输入后按确认或返回键继续选择。
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-xs font-medium text-[#4B525E] dark:text-[#B3B9C4] mb-1.5"
                >
                  用户名
                </label>
                <div className="relative flex items-center">
                  <User
                    className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#7E8591]"
                    aria-hidden="true"
                  />
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="输入用户名"
                    className="h-11 w-full rounded-lg border border-black/10 dark:border-white/10 bg-[#F7F6F2] dark:bg-[#0A0B0E] pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-medium text-[#4B525E] dark:text-[#B3B9C4] mb-1.5"
                >
                  访问密码
                </label>
                <div className="relative flex items-center">
                  <Lock
                    className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#7E8591]"
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入访问密码"
                    className="h-11 w-full rounded-lg border border-black/10 dark:border-white/10 bg-[#F7F6F2] dark:bg-[#0A0B0E] pl-10 pr-11 text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                    className="absolute right-3 text-[#7E8591] hover:text-[#14161A] dark:hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {authTab === 'register' && (
                <div>
                  <label
                    htmlFor="login-invite"
                    className="block text-xs font-medium text-[#4B525E] dark:text-[#B3B9C4] mb-1.5"
                  >
                    邀请码
                  </label>
                  <div className="relative flex items-center">
                    <Ticket
                      className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#7E8591]"
                      aria-hidden="true"
                    />
                    <input
                      id="login-invite"
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      placeholder="输入邀请码"
                      className="h-11 w-full rounded-lg border border-black/10 dark:border-white/10 bg-[#F7F6F2] dark:bg-[#0A0B0E] pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {authTab === 'login' && (
                <label className="flex items-center gap-2.5 text-xs text-[#4B525E] dark:text-[#B3B9C4] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember30Days}
                    onChange={(e) => setRemember30Days(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#E5A93C]"
                  />
                  <span>在此设备保持登录 30 天</span>
                </label>
              )}

              {errorMsg && (
                <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[#14161A] dark:bg-[#E5A93C] text-sm font-semibold text-white dark:text-[#0A0B0E] hover:opacity-90 transition-opacity"
              >
                {authTab === 'login' ? '进入 KatelyaTV' : '创建 KatelyaTV 账号'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
