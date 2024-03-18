import { IAlbum, IPlaylist, IStoreProps, StoreName } from 'core/stores/Store.model';
import { inject, observer } from 'mobx-react';
import { ViewType, ViewTypes } from 'shared/enums/viewTypeEnum';
import { useTranslation } from 'react-i18next';

const { STORE } = StoreName;
const { BROWSE, BROWSE_GENRES, RECENTLY_PLAYED, TRACKS, ALBUMS, ARTISTS, MY_PLAYLISTS, MY_ALBUMS } = ViewType;

interface IMenu {
  type?: ViewTypes;
  name?: string;
  data?: IAlbum[] | IPlaylist[];
  action?: () => void;
}

const Menu = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};
    const { viewType, artistIds, albumsIds, myAlbums, playlistMenu } = Store || {};
    const { t } = useTranslation();

    const handleClick = (name: ViewTypes): void => {
      Store?.updateViewType?.(name as ViewTypes);
    };

    const handleBrowseClick = (): void => {
      Store?.updateViewType?.(BROWSE_GENRES as ViewTypes);
      Store?.fetchNewReleases?.();
      Store?.fetchCategories?.();
      Store?.fetchFeatured?.();
    };

    const getMyTracks = (data: IAlbum | IPlaylist, type: string): void => {
      switch (type) {
        case MY_PLAYLISTS:
          Store?.fetchPlaylistSongs?.(data.id as string);
          break;
        case MY_ALBUMS:
          Store?.fetchAlbum?.(data.id as string);
          break;
        default:
          break;
      }
      Store?.updateViewType?.(data.type as ViewTypes);
      Store?.setCurrentPlaylist?.((data as any) ?? {});
    };

    const renderSideMenu = (): JSX.Element | JSX.Element[] | undefined => {
      const menu: IMenu[] = [
        {
          name: 'menu.browse',
          type: BROWSE,
          action: () => handleBrowseClick?.(),
        },
        {
          name: 'menu.recentlyPlayed',
          type: RECENTLY_PLAYED,
          action: () => Store?.fetchRecentlyPlayed?.(),
        },
        {
          name: 'menu.tracks',
          type: TRACKS,
          action: () => Store?.fetchSongs?.(),
        },
        {
          name: 'menu.albums',
          type: ALBUMS,
          action: () => Store?.fetchAlbums?.(albumsIds ?? []),
        },
        {
          name: 'menu.artists',
          type: ARTISTS,
          action: () => Store?.fetchArtists?.(artistIds ?? []),
        },
        {
          name: 'menu.myPlaylist',
          type: MY_PLAYLISTS,
          data: playlistMenu,
        },
        {
          name: 'menu.myAlbums',
          type: MY_ALBUMS,
          data: myAlbums,
        },
      ];

      return menu?.map(item => (
        <li
          role="presentation"
          key={item.name}
          className={`item ${viewType === item?.type && !item.data ? 'active' : ''}`}
          onClick={() => {
            handleClick?.(item?.type as ViewTypes);
            item?.action?.();
          }}
        >
          <span>{t(item?.name as string)}</span>
          {item?.data?.length && (
            <ul className="menu menu-sub">
              {item?.data?.map((data, i) => (
                <li role="presentation" onClick={() => getMyTracks(data as IPlaylist, item.type as string)} className="item" key={data.id}>
                  {data.name}
                </li>
              ))}
            </ul>
          )}
        </li>
      ));
    };

    return <ul className="menu">{renderSideMenu()}</ul>;
  })
);

export default Menu;
