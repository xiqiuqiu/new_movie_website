import { useCallback, useEffect, useState } from 'react';
import { AppShell } from './components/AppShell';
import { DiscoverView } from './components/DiscoverView';
import { FavoritesView } from './components/FavoritesView';
import { HistoryView } from './components/HistoryView';
import { HomeView } from './components/HomeView';
import { LoginPreviewView } from './components/LoginPreviewView';
import { PlayerView } from './components/PlayerView';
import { SearchView } from './components/SearchView';
import { SettingsModal } from './components/SettingsModal';
import { CATALOG_ITEMS, INITIAL_HISTORY } from './data/catalog';
import type {
  DiscoverFilterState,
  HistoryEntry,
  MediaItem,
  MediaKind,
  NavSection,
  SearchMode,
  UserPreferences,
} from './types/media';
import { toggleFavoriteIds, upsertHistoryProgress } from './utils/catalogLogic';

export default function App() {
  const [section, setSection] = useState<NavSection>('home');
  const [previousSection, setPreviousSection] = useState<NavSection>('home');
  const [username, setUsername] = useState('grok-bot');

  const [prefs, setPrefs] = useState<UserPreferences>({
    theme: 'dark',
    tvMode: false,
    autoPlayNext: true,
    skipIntroOutro: false,
    aggregateSearch: true,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('normal');
  const [discoverFilters, setDiscoverFilters] = useState<DiscoverFilterState>({
    kind: 'movie',
    collection: 'popular',
    region: 'all',
    sortBy: 'default',
  });

  const [favoriteIds, setFavoriteIds] = useState<string[]>([
    'aodesai',
    'clarksons-farm-5',
  ]);
  const [history, setHistory] = useState<HistoryEntry[]>(INITIAL_HISTORY);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [playerState, setPlayerState] = useState<{
    mediaId: string;
    episode: number;
    sourceName: string;
    initialSeconds: number;
  }>({
    mediaId: CATALOG_ITEMS[0].id,
    episode: 2,
    sourceName: CATALOG_ITEMS[0].sources[0].name,
    initialSeconds: 189,
  });

  // Sync Tailwind v4 `.dark` class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (prefs.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [prefs.theme]);

  const handleNavigate = useCallback(
    (next: NavSection) => {
      if (next !== 'player' && next !== 'login') {
        setPreviousSection(next);
      }
      setSection(next);
    },
    []
  );

  const handlePlayMedia = useCallback(
    (item: MediaItem, episode?: number, sourceName?: string) => {
      const existing = history.find((h) => h.mediaId === item.id);
      const targetEpisode = episode ?? existing?.episode ?? 1;
      const targetSource = sourceName ?? existing?.sourceName ?? item.sources[0]?.name ?? '如意资源';
      const startSeconds =
        existing && existing.episode === targetEpisode ? existing.positionSeconds : 0;

      setPreviousSection(section === 'player' ? previousSection : section);
      setPlayerState({
        mediaId: item.id,
        episode: targetEpisode,
        sourceName: targetSource,
        initialSeconds: startSeconds,
      });
      setSection('player');
    },
    [history, previousSection, section]
  );

  const handleToggleFavorite = useCallback((mediaId: string) => {
    setFavoriteIds((prev) => toggleFavoriteIds(prev, mediaId));
  }, []);

  const handleDeleteHistoryItems = useCallback((mediaIds: string[]) => {
    setHistory((prev) => prev.filter((entry) => !mediaIds.includes(entry.mediaId)));
  }, []);

  const handleUpdateProgress = useCallback(
    (episode: number, positionSeconds: number, durationSeconds: number, sourceName: string) => {
      const percent = Math.max(
        1,
        Math.min(100, Math.round((positionSeconds / Math.max(1, durationSeconds)) * 100))
      );
      setHistory((prev) =>
        upsertHistoryProgress(prev, {
          mediaId: playerState.mediaId,
          episode,
          progressPercent: percent,
          sourceName,
          watchedAtIso: new Date().toISOString(),
          positionSeconds: Math.floor(positionSeconds),
        })
      );
    },
    [playerState.mediaId]
  );

  const handleOpenDiscoverKind = useCallback((kind: MediaKind) => {
    setDiscoverFilters((prev) => ({ ...prev, kind }));
    setSection('discover');
  }, []);

  const handleSubmitSearch = useCallback((mode: SearchMode = 'normal') => {
    setSearchMode(mode);
    setSection('search');
  }, []);

  if (section === 'login') {
    return (
      <LoginPreviewView
        theme={prefs.theme}
        onToggleTheme={() =>
          setPrefs((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))
        }
        tvMode={prefs.tvMode}
        onToggleTvMode={() => setPrefs((p) => ({ ...p, tvMode: !p.tvMode }))}
        onSignInSuccess={(name) => {
          setUsername(name);
          setSection('home');
        }}
        onReturnToApp={() => setSection(previousSection)}
      />
    );
  }

  const activePlayerItem =
    CATALOG_ITEMS.find((item) => item.id === playerState.mediaId) ?? CATALOG_ITEMS[0];
  const relatedItems = CATALOG_ITEMS.filter(
    (item) => item.id !== activePlayerItem.id && item.kind === activePlayerItem.kind
  ).slice(0, 6);

  return (
    <AppShell
      activeSection={section}
      onNavigate={handleNavigate}
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
      onSubmitSearch={handleSubmitSearch}
      theme={prefs.theme}
      onToggleTheme={() =>
        setPrefs((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))
      }
      tvMode={prefs.tvMode}
      onToggleTvMode={() => setPrefs((p) => ({ ...p, tvMode: !p.tvMode }))}
      onOpenSettings={() => setSettingsOpen(true)}
      onOpenLoginPreview={() => setSection('login')}
      username={username}
      favoritesCount={favoriteIds.length}
      historyCount={history.length}
    >
      {section === 'home' && (
        <HomeView
          catalog={CATALOG_ITEMS}
          history={history}
          favoriteIds={favoriteIds}
          onPlayMedia={handlePlayMedia}
          onToggleFavorite={handleToggleFavorite}
          onRemoveHistoryItem={(id) => handleDeleteHistoryItems([id])}
          onOpenDiscoverKind={handleOpenDiscoverKind}
          onOpenHistory={() => setSection('history')}
        />
      )}

      {section === 'discover' && (
        <DiscoverView
          catalog={CATALOG_ITEMS}
          filters={discoverFilters}
          onChangeFilters={setDiscoverFilters}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onPlayMedia={(item) => handlePlayMedia(item, 1, item.sources[0]?.name)}
        />
      )}

      {section === 'search' && (
        <SearchView
          catalog={CATALOG_ITEMS}
          query={searchQuery}
          onQueryChange={setSearchQuery}
          mode={searchMode}
          onModeChange={setSearchMode}
          aggregateSources={prefs.aggregateSearch}
          onToggleAggregate={() =>
            setPrefs((p) => ({ ...p, aggregateSearch: !p.aggregateSearch }))
          }
          onPlayMedia={handlePlayMedia}
        />
      )}

      {section === 'favorites' && (
        <FavoritesView
          catalog={CATALOG_ITEMS}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onPlayMedia={(item) => handlePlayMedia(item, 1, item.sources[0]?.name)}
          onExploreDiscover={() => setSection('discover')}
        />
      )}

      {section === 'history' && (
        <HistoryView
          catalog={CATALOG_ITEMS}
          history={history}
          onPlayMedia={handlePlayMedia}
          onDeleteHistoryItems={handleDeleteHistoryItems}
          onBackHome={() => setSection('home')}
        />
      )}

      {section === 'player' && (
        <PlayerView
          item={activePlayerItem}
          episode={playerState.episode}
          sourceName={playerState.sourceName}
          initialPositionSeconds={playerState.initialSeconds}
          isFavorite={favoriteIds.includes(activePlayerItem.id)}
          tvMode={prefs.tvMode}
          relatedItems={relatedItems}
          onBack={() => setSection(previousSection)}
          onSelectEpisode={(ep) =>
            setPlayerState((p) => ({ ...p, episode: ep, initialSeconds: 0 }))
          }
          onSelectSource={(src) =>
            setPlayerState((p) => ({ ...p, sourceName: src }))
          }
          onUpdateProgress={handleUpdateProgress}
          onToggleFavorite={handleToggleFavorite}
          onToggleTvMode={() => setPrefs((p) => ({ ...p, tvMode: !p.tvMode }))}
          onPlayRelated={(rel) => handlePlayMedia(rel, 1, rel.sources[0]?.name)}
        />
      )}

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        prefs={prefs}
        onUpdatePrefs={setPrefs}
        username={username}
        onOpenLoginPreview={() => setSection('login')}
      />
    </AppShell>
  );
}
