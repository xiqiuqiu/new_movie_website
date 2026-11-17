export type MediaKind = 'movie' | 'series' | 'variety';

export type MediaRegion = 'all' | 'chinese' | 'western' | 'korean' | 'japanese';

export type DiscoverCollection = 'popular' | 'latest' | 'top_rated' | 'hidden_gems';

export type SortOption = 'default' | 'rating_desc' | 'year_desc';

export type NavSection =
  | 'home'
  | 'discover'
  | 'favorites'
  | 'history'
  | 'search'
  | 'player'
  | 'login';

export type SearchMode = 'normal' | 'ai';

export interface MediaSource {
  id: string;
  name: string;
  quality: '4K HDR' | '1080P' | '720P';
  episodesAvailable: number;
  latencyLabel: string;
}

export interface PosterTheme {
  bgFrom: string;
  bgTo: string;
  accent: string;
  motif: 'grid' | 'aperture' | 'waves' | 'monolith' | 'split' | 'frame';
  subtitleEn: string;
}

export interface MediaItem {
  id: string;
  title: string;
  originalTitle?: string;
  kind: MediaKind;
  genreLabel: string;
  region: Exclude<MediaRegion, 'all'>;
  year: number;
  rating: number | null;
  doubanUrl: string;
  episodesCount: number;
  durationMinutes: number;
  directorOrHost: string;
  cast: string[];
  synopsis: string;
  backdropImage?: string;
  posterImage?: string;
  posterTheme: PosterTheme;
  collections: DiscoverCollection[];
  sources: MediaSource[];
  tags: string[];
}

export interface HistoryEntry {
  mediaId: string;
  episode: number;
  progressPercent: number;
  sourceName: string;
  watchedAtIso: string;
  positionSeconds: number;
}

export interface DiscoverFilterState {
  kind: MediaKind;
  collection: DiscoverCollection;
  region: MediaRegion;
  sortBy: SortOption;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  tvMode: boolean;
  autoPlayNext: boolean;
  skipIntroOutro: boolean;
  aggregateSearch: boolean;
}

export interface EpisodeChunk {
  label: string;
  start: number;
  end: number;
  episodes: number[];
}

export interface AiMatchResult {
  item: MediaItem;
  score: number;
  reason: string;
}
