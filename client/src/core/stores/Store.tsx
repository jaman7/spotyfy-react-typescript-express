import { observable, configure, makeObservable, action, runInAction, computed } from 'mobx';
import { IAlbum, IAlbums, IArtists, IAuth, IAuthData, IPlayState, IPlaylist, IStore, ITrack, ITracks, IUser } from './Store.model';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-node';
import { uniqBy } from 'shared/utils/utils';
import React, { createRef } from 'react';
import { ViewTypes } from 'shared/enums/viewTypeEnum';

const { REDIRECT_URL, APP_BASE_URL, SPOTIFY_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

configure({
  enforceActions: 'never',
});

class Store implements IStore {
  authData: IAuthData = {
    APP_BASE_URL,
    REDIRECT_URL,
    SPOTIFY_URL,
    CLIENT_ID,
    CLIENT_SECRET,
  };

  // user;
  auth: IAuth = {
    accessToken: '',
    refreshToken: '',
    expiresIn: null,
  };

  user: IUser = {};

  // state
  sidebarStatus = true;
  playState: IPlayState = {
    songPlaying: false,
    songPaused: true,
  };
  isPlaying: boolean = false;
  audioRef = createRef<HTMLAudioElement>();
  isLoading = true;

  spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
  });

  tracks: ITrack[] = [];
  playlistMenu: IPlaylist[] = [];
  currentPlaylist: IPlaylist = {};
  playlists: IPlaylist[] = [];
  currentTrack: ITrack = {};
  albums: IAlbum[] = [];
  myAlbums: IAlbum[] = [];
  currentAlbum: IAlbum = {};
  artists: IArtists[] = [];
  currentArtist: IArtists = {};

  categories: any[] = [];
  categoriesPlaylists: any[] = [];
  newReleases: [] = [];
  featured: [] = [];
  browseView: any[] = [];
  title = '';
  viewType = '';
  type = 'start';
  tableMaxHeight: number = 0;
  artistIds: string[] = [];
  albumsIds: string[] = [];

  setAuth = (auth: IAuth): void => {
    runInAction(() => {
      if (auth) {
        this.auth = auth;
      }
    });
  };

  // geters
  get getAccessToken(): string {
    return this.auth.accessToken as string;
  }

  get getUserId(): string {
    return this.user.id as string;
  }

  // action
  setSidebarStatus = (state: boolean) => {
    runInAction(() => {
      this.sidebarStatus = !state;
      this.setPlay(!this.isPlaying);
    });
  };

  updateHeaderTitle = (title: ViewTypes): void => {
    runInAction(() => {
      this.title = title;
    });
  };

  updateViewType = (view: ViewTypes): void => {
    runInAction(() => {
      this.viewType = view;
    });
  };

  setTableMaxHeight = (height: number): void => {
    runInAction(() => {
      this.tableMaxHeight = height;
    });
  };

  setCurrentTracks = (tracks: ITracks[]): void => {
    runInAction(() => {
      this.tracks = tracks;
    });
  };

  setCurrentPlaylist = (view: IPlaylist): void => {
    runInAction(() => {
      this.currentPlaylist = view;
    });
  };

  updateArtistIds = (view: string[]): void => {
    runInAction(() => {
      this.artistIds = view;
    });
  };

  setcurrentArtist = (view: IArtists): void => {
    runInAction(() => {
      this.currentArtist = view;
    });
  };

  setCurrentAlbum = (view: IAlbum): void => {
    runInAction(() => {
      this.currentAlbum = view;
    });
  };

  setBrowseView = (view: any[]): void => {
    runInAction(() => {
      this.browseView = view;
    });
  };

  setCurrentTrack = (track: ITrack): Promise<void> => {
    return new Promise(resolve => {
      runInAction(() => {
        this.currentTrack = track ?? {};
        if (this.audioRef.current?.played) {
          this.setPlay?.(true);
        } else {
          this.setPlay?.(false);
        }
        resolve();
      });
    });
  };

  setPlay = (isPlaying: boolean): void => {
    runInAction(() => {
      this.isPlaying = isPlaying;
    });
  };

  uniqBy = (arr: any[], predicate: () => any): any[] => {
    if (!Array.isArray(arr)) {
      return [];
    }
    const cb = typeof predicate === 'function' ? predicate : o => o[predicate];
    const pickedObjects = arr
      .filter(item => item)
      .reduce((map, item) => {
        const key = cb(item);
        if (!key) {
          return map;
        }
        return map.has(key) ? map : map.set(key, item);
      }, new Map())
      .values();
    return [...pickedObjects];
  };

  setCurrentTrackPlay = (track: ITrack, isPlaying: boolean, audioRef: React.RefObject<HTMLAudioElement>): void => {
    runInAction(async () => {
      this.currentTrack = track ?? {};
      setTimeout(() => {
        if (isPlaying) {
          audioRef.current?.pause();
        } else {
          audioRef.current?.play();
        }
        this.setPlay?.(!isPlaying);
      }, 10);
    });
  };

  playAudio(isPlaying: boolean, audioRef: React.RefObject<HTMLAudioElement>): void {
    if (isPlaying) {
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audioRef.current?.play();
          })
          .catch(error => console.log(error));
      }
    }
  }

  playSongHandler(isPlaying: boolean, audioRef: React.RefObject<HTMLAudioElement>): void {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }

  async fetchUser(): Promise<void> {
    axios
      .post(`${process.env.APP_BASE_URL}/me`, { token: this.auth.accessToken })
      .then(res => {
        if (res.statusText === 'Unauthorized') {
          window.location.href = './';
        } else {
          runInAction(() => {
            this.user = res.data;
            this.type = 'FETCH_USER_SUCCESS';
            this.fetchSongs();
            this.fetchPlaylistsMenu();
            this.fetchMyAlbums();
          });
        }
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  async fetchSongs(): Promise<void> {
    axios
      .post(`${process.env.APP_BASE_URL}/me/tracks`, { token: this.auth.accessToken })
      .then(response => {
        const items = response.data.items.map(item => item.track);
        const tracks = items.filter(item => item.preview_url != null);
        const dataartistIds = uniqBy(response.data.items, item => item.track.artists[0].name)
          .map(item => item.track.artists[0].id)
          .join(',');
        runInAction(() => {
          this.artistIds = [dataartistIds];
          this.tracks = (tracks as ITracks[]) ?? [];
          this.type = 'FETCH_SONGS_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  async fetchPlaylistsMenu(): Promise<void> {
    axios
      .post(`${process.env.APP_BASE_URL}/users/${this.getUserId}/playlists`, { token: this.auth.accessToken })
      .then(response => {
        runInAction(() => {
          this.playlistMenu = response.data.items;
          this.type = 'FETCH_PLAYLIST_MENU_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_PLAYLIST_MENU_type';
        });
      });
  }

  async fetchMyAlbums(): Promise<void> {
    this.isLoading = true;
    axios
      .post(`${process.env.APP_BASE_URL}/me/albums`, { token: this.auth.accessToken })
      .then(response => {
        runInAction(() => {
          this.myAlbums = response?.data?.items?.map(el => el.album) ?? [];
          this.type = 'FETCH_USER_ALBUMS_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_USER_ALBUMS_type';
        });
      });
  }

  async fetchPlaylistSongs(playlistId: string): Promise<void> {
    axios
      .post(`${process.env.APP_BASE_URL}/users/${this.getUserId}/playlists/${playlistId}/tracks`, { token: this.auth.accessToken })
      .then(response => {
        const items = response.data.items.map(item => item.track);
        const tracks = items.filter(item => item.preview_url != null);
        runInAction(() => {
          this.tracks = (tracks as ITracks[]) ?? [];
          this.type = 'FETCH_PLAYLIST_SONGS_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_PLAYLIST_SONGS_type';
        });
      });
  }

  async searchTracks(searchTerm: string): Promise<void> {
    this.isLoading = true;
    axios
      .get(`${process.env.APP_BASE_URL}/search?q=${searchTerm}&type=track&token=${this.auth.accessToken}`)
      .then(response => {
        const items = response?.data?.tracks?.items?.filter(item => item.preview_url != null) ?? [];

        const data = this.uniqBy(items, item => item.id);
        runInAction(() => {
          this.tracks = (data as ITracks[]) ?? [];
          this.type = 'SEARCH_SONGS_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'SEARCH_SONGS_type';
        });
      });
  }

  async fetchRecentlyPlayed(): Promise<void> {
    this.isLoading = true;
    axios
      .post(`${process.env.APP_BASE_URL}/me/player/recently-played`, { token: this.auth.accessToken })
      .then(response => {
        const items = response.data.items.map(item => item.track);
        const tracks = this.uniqBy(items, item => item?.id);
        runInAction(() => {
          this.tracks = tracks?.filter(item => item.preview_url != null) ?? [];
          this.type = 'FETCH_RECENTLY_PLAYED_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_RECENTLY_PLAYED_type';
        });
      });
  }

  async fetchAlbums(albumsIds: string[]): Promise<void> {
    this.isLoading = true;
    axios
      .post(`${process.env.APP_BASE_URL}/albums`, { token: this.auth.accessToken, albumsIds })
      .then(res => {
        const items = res?.data?.tracks?.items?.filter(item => item.preview_url != null) ?? [];
        runInAction(() => {
          this.tracks = items;
          this.type = 'FETCH_ALBUMS_SONGS_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.setCurrentTracks?.([]);
          this.isLoading = false;
          this.type = 'FETCH_ALBUMS_SONGS_ERROR';
        });
      });
  }

  async fetchAlbum(albumid: string): Promise<void> {
    this.isLoading = true;
    axios
      .post(`${process.env.APP_BASE_URL}/album/${albumid}`, { token: this.auth.accessToken })
      .then(res => {
        const { tracks, images } = res?.data || {};
        const items = tracks?.items?.filter(item => item.preview_url != null)?.map(el => ({ ...el, images })) ?? [];
        runInAction(() => {
          this.tracks = items;
          this.setCurrentPlaylist(res?.data);
          this.type = 'FETCH_ALBUMS_SONGS_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_ALBUMS_SONGS_ERROR';
        });
      });
  }

  async fetchArtistAlbums(artistId: string): Promise<void> {
    this.isLoading = true;
    axios
      .post(`${process.env.APP_BASE_URL}/artist/${artistId}/albums`, { token: this.auth.accessToken })
      .then(response => {
        runInAction(() => {
          this.albums = response?.data?.items ?? [];
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_ARTIST_ERROR';
        });
      });
  }

  async fetchArtistSongs(artistId: string): Promise<void> {
    this.isLoading = true;
    axios
      .post(`${process.env.APP_BASE_URL}/artist/${artistId}/tracks`, { token: this.auth.accessToken })
      .then(response => {
        runInAction(() => {
          this.tracks = response?.data?.tracks ?? [];
          this.type = 'FETCH_ARTIST_SONGS_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_ALBUMS_type';
        });
      });
  }

  async fetchNewReleases(): Promise<void> {
    this.isLoading = true;
    axios
      .post(`${process.env.APP_BASE_URL}/browse/new-releases`, { token: this.auth.accessToken })
      .then(response => {
        runInAction(() => {
          this.isLoading = false;
          this.newReleases = response?.data?.albums?.items ?? [];
          this.type = 'FETCH_NEW_RELEASES_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_ALBUMS_type';
        });
      });
  }

  async fetchFeatured(): Promise<void> {
    this.isLoading = true;
    axios
      .post(`${process.env.APP_BASE_URL}/browse/featured-playlists`, { token: this.auth.accessToken })
      .then(response => {
        runInAction(() => {
          this.featured = response?.data?.playlists?.items ?? [];
          this.type = 'FETCH_FEATURED_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_FEATURED_type';
        });
      });
  }

  async fetchCategories(): Promise<void> {
    try {
      const part1 = await axios.post(`${process.env.APP_BASE_URL}/browse/categories`, { token: this.auth.accessToken, offset: 0 });
      const part2 = await axios.post(`${process.env.APP_BASE_URL}/browse/categories`, { token: this.auth.accessToken, offset: 50 });
      const part1Requests = part1?.data?.categories?.items ?? [];
      const part2Requests = part2?.data?.categories?.items ?? [];
      const all = await Promise.all([part1Requests, part2Requests]);
      const [data1, data2] = all || [];
      const dataAll = [...data1, ...data2];
      runInAction(() => {
        this.categories = dataAll ?? [];
        this.type = 'FETCH_CATEGORIES_SUCCESS';
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        this.type = 'FETCH_CATEGORIES_type';
      });
    }
  }

  async fetchCategorie(category: string): Promise<void> {
    this.isLoading = true;
    axios
      .post(`${process.env.APP_BASE_URL}/browse/categories/${category}/playlists`, { token: this.auth.accessToken })
      .then(response => {
        runInAction(() => {
          this.categories = response?.data?.categories?.items ?? [];
          this.type = 'FETCH_CATEGORIES_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_CATEGORIES_type';
        });
      });
  }

  async fetchCategoriesPlaylist(categoryId: string): Promise<void> {
    this.isLoading = true;
    axios
      .post(`${process.env.APP_BASE_URL}/browse/categories/${categoryId}/playlists`, { token: this.auth.accessToken })
      .then(response => {
        runInAction(() => {
          this.categoriesPlaylists = response.data.playlists.items;
          this.type = 'FETCH_CATEGORIES_Playlist_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_CATEGORIES_Playlist_ERROR';
        });
      });
  }

  async fetchPlaylistTracks(playlistId: string): Promise<void> {
    axios
      .post(`${process.env.APP_BASE_URL}/playlists/${playlistId}/tracks`, { token: this.auth.accessToken })
      .then(response => {
        const items = response.data.items.map(item => item.track);
        const tracks = items.filter(item => item.preview_url != null);
        runInAction(() => {
          this.tracks = (tracks as ITracks[]) ?? [];
          this.type = 'FETCH_PLAYLIST_SONGS_SUCCESS';
          this.isLoading = false;
        });
      })
      .catch(() => {
        runInAction(() => {
          this.isLoading = false;
          this.type = 'FETCH_PLAYLIST_SONGS_type';
        });
      });
  }

  constructor() {
    makeObservable(this, {
      authData: observable,
      auth: observable,
      user: observable,
      sidebarStatus: observable,
      playState: observable,
      isPlaying: observable,
      audioRef: observable,
      isLoading: observable,
      spotifyApi: observable,

      tracks: observable,
      playlistMenu: observable,
      playlists: observable,
      currentPlaylist: observable,
      currentTrack: observable,
      albums: observable,
      myAlbums: observable,
      currentAlbum: observable,
      artists: observable,
      currentArtist: observable,
      categories: observable,
      categoriesPlaylists: observable,
      newReleases: observable,
      featured: observable,
      browseView: observable,
      title: observable,
      viewType: observable,
      type: observable,
      tableMaxHeight: observable,
      artistIds: observable,
      albumsIds: observable,

      getAccessToken: computed,
      getUserId: computed,

      playAudio: action,
      playSongHandler: action,
      setAuth: action,
      setSidebarStatus: action,
      setCurrentTrackPlay: action,
      setPlay: action,
      updateHeaderTitle: action,
      updateViewType: action,
      setTableMaxHeight: action,
      setCurrentPlaylist: action,
      setCurrentTracks: action,
      setCurrentTrack: action,
      setCurrentAlbum: action,
      fetchUser: action,
      fetchSongs: action,
      fetchPlaylistsMenu: action,
      fetchPlaylistSongs: action,
      searchTracks: action,
      fetchMyAlbums: action,
      fetchRecentlyPlayed: action,
      fetchAlbums: action,
      fetchAlbum: action,
      fetchArtistAlbums: action,
      fetchArtistSongs: action,
      fetchNewReleases: action,
      fetchFeatured: action,
      fetchCategories: action,
      fetchCategorie: action,
      fetchCategoriesPlaylist: action,
      fetchPlaylistTracks: action,
      uniqBy: action,
    });
  }
}

export default new Store();
