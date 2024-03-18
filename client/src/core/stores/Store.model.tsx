import { ViewTypes } from 'shared/enums/viewTypeEnum';
import SpotifyWebApi from 'spotify-web-api-node';

export interface IAuth {
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresIn?: number | null;
}

export interface IAuthData {
  APP_BASE_URL?: string;
  REDIRECT_URL?: string;
  SPOTIFY_URL?: string;
  CLIENT_ID?: string;
  CLIENT_SECRET?: string;
}

export interface IUser {
  display_name?: string;
  external_urls?: {
    spotify?: string;
  };
  href?: string;
  id?: string;
  images?: any[];
  type?: string;
  uri?: string;
  followers?: {
    href?: string | null;
    total?: number | null;
  };
  country?: string;
  product?: string;
  explicit_content?: {
    filter_enabled?: boolean;
    filter_locked?: boolean;
  };
  email?: string;
}

export interface IPlayState {
  songPlaying?: boolean;
  songPaused?: boolean;
}

export interface IImages {
  height?: number | null;
  url?: string | null;
  width?: number | null;
}

export interface IArtists {
  external_urls?: {
    spotify?: string | null;
  };
  href?: string | null;
  id?: string | null;
  name?: string | null;
  type?: string | null;
  uri?: string | null;
}

export interface IAlbum {
  albumName?: string | null;
  artistName?: string | null;
  img?: string | null;

  album_type?: string | null;
  artists?: IArtists[];
  available_markets?: any[];
  external_ids?: {
    upc?: string | null;
  };
  external_urls?: {
    spotify?: string | null;
  };
  genres?: any[];
  href?: string | null;
  id?: string | null;
  images?: IImages[];
  label?: string | null;
  name?: string | null;
  popularity?: number | null;
  release_date?: string | null;
  release_date_precision?: string | null;
  tracks?: ITrack[];
  total_tracks?: number | null;
  type?: string | null;
  uri?: string | null;
}

export interface ITrack {
  album?: IAlbum[];
  artists?: IArtists[];
  available_markets?: any[];
  disc_number?: number | null;
  duration_ms?: number | null;
  explicit?: boolean;
  external_ids?: {
    isrc?: string | null;
  };
  external_urls?: {
    spotify?: string | null;
  };
  href?: string | null;
  id?: string;
  is_local?: boolean;
  name?: string | null;
  popularity?: number | null;
  preview_url?: string | null;
  track_number?: number | null;
  type?: string | null;
  uri?: string | null;
  [name: string]: any;
}

export interface ITracks {
  added_at?: string | null;
  track?: ITrack;
}

export interface IPlaylist {
  collaborative?: boolean;
  description?: string | null;
  external_urls?: {
    spotify?: string | null;
  };
  artists?: IArtists[];
  href?: string | null;
  id?: string | null;
  images?: IImages[];
  name?: string | null;
  owner?: {
    display_name?: string | null;
    external_urls?: {
      spotify?: string | null;
    };
    href?: string | null;
    id?: string | null;
    type?: string | null;
    uri?: string | null;
  };
  primary_color?: string | null;
  public?: boolean;
  snapshot_id?: string | null;
  tracks?: {
    href?: string | null;
    total?: number | null;
  };
  total_tracks?: number | null;
  type?: string | null;
  uri?: string | null;
}

export interface IStore {
  auth?: IAuth;
  authData?: IAuthData;
  user?: IUser;
  sidebarStatus?: boolean;
  playState?: IPlayState;
  isPlaying?: boolean;
  audioRef?: React.RefObject<HTMLAudioElement>;
  isLoading?: boolean;
  spotifyApi?: SpotifyWebApi;

  playlistMenu?: IPlaylist[];
  playlists?: IPlaylist[];
  currentPlaylist?: IPlaylist;
  tracks?: ITrack[];
  currentTrack?: ITrack;
  albums?: IAlbum[];
  myAlbums?: IAlbum[];
  currentAlbum?: IAlbum;
  artists?: IArtists[];
  currentArtist?: IArtists;

  title?: string;
  viewType?: string;
  type?: string;
  tableMaxHeight?: number;
  artistIds?: string[];
  albumsIds?: string[];
  categories?: any[];
  categoriesPlaylists?: any[];
  newReleases?: any[];
  featured?: any[];
  browseView?: any[];

  readonly getAccessToken?: string;
  readonly getUserId?: string;
  setAuth?: (auth: IAuth) => void;
  setSidebarStatus?: (state: boolean) => void;
  updateHeaderTitle?: (title: ViewTypes) => void;
  updateViewType?: (view: ViewTypes) => void;
  setTableMaxHeight?: (height: number) => void;
  setCurrentPlaylist?: (view: IPlaylist) => void;
  setCurrentTrack?: (track: ITrack) => Promise<void>;
  setCurrentTracks?: (tracks: ITracks[]) => void;
  setCurrentAlbum?: (view: IAlbum) => void;
  setcurrentArtist?: (view: IArtists) => void;
  fetchUser?: () => Promise<void>;
  fetchSongs?: () => Promise<void>;
  fetchPlaylistsMenu?: () => Promise<void>;
  fetchPlaylistSongs?: (playlistId: string) => Promise<void>;
  searchTracks?: (searchTerm: string) => Promise<void>;
  fetchMyAlbums?: () => void;
  fetchRecentlyPlayed?: () => void;
  fetchAlbums?: (albumsIds: string[]) => Promise<void>;
  fetchAlbum?: (albumid: string) => Promise<void>;
  fetchArtists?: (artistIds: string[]) => Promise<void>;
  fetchArtistAlbums?: (artistId: string) => Promise<void>;
  fetchNewReleases?: () => void;
  fetchFeatured?: () => void;
  fetchCategories?: () => void;
  fetchCategorie?: (category: string) => Promise<void>;
  fetchCategoriesPlaylist?: (categoryId: string) => Promise<void>;
  fetchPlaylistTracks?: (playlistId: string) => Promise<void>;
  playAudio?: (isPlaying: boolean, audioRef: React.RefObject<HTMLAudioElement>) => void;
  playSongHandler?: (isPlaying: boolean, audioRef: React.RefObject<HTMLAudioElement>) => void;
  setCurrentTrackPlay?: (track: ITrack, isPlaying: boolean, audioRef: React.RefObject<HTMLAudioElement>) => void;

  setPlay?: (isPlaying: boolean) => void;
  uniqBy?: (arr: any[], predicate: () => any) => any[];
}

export interface IStoreProps {
  Store?: IStore;
}

export enum StoreName {
  STORE = 'Store',
}
