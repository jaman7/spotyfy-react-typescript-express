import { inject, observer } from 'mobx-react';
import SimpleBar from 'simplebar-react';
import BrowseViewItem from './BrowseViewItem';
import { IPlaylist, IStoreProps, StoreName } from 'core/stores/Store.model';
import { ViewType, ViewTypes } from 'shared/enums/viewTypeEnum';

const { STORE } = StoreName;
const { BROWSE, PLAYLIST, BROWSE_GENRES_PLAYLISTS, ALBUM, BROWSE_GENRES, BROWSE_NEW_RELEASES, BROWSE_FEATURED } = ViewType;

const BrowseView = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};

    const { viewType, categories, newReleases, featured, categoriesPlaylists } = Store || {};

    const getCategoriesPlaylist = (item: any): void => {
      Store?.fetchCategoriesPlaylist?.(item?.id);
      Store?.updateHeaderTitle?.(BROWSE);
      Store?.updateViewType?.(BROWSE_GENRES_PLAYLISTS);
    };

    const getPlaylistSongs = (item: IPlaylist): void => {
      Store?.fetchPlaylistTracks?.(item?.id as string);
      Store?.updateHeaderTitle?.(item?.name as ViewTypes);
      Store?.updateViewType?.(PLAYLIST as ViewTypes);
      Store?.setCurrentPlaylist?.(item as IPlaylist);
    };

    const artistSongsAction = (item: any): void => {
      const album = {
        albumName: item?.name,
        artistName: item?.artists?.[0]?.name,
        img: item?.images?.[0]?.url,
      };
      Store?.fetchAlbum?.(item?.id);
      Store?.updateHeaderTitle?.(item?.name);
      Store?.updateViewType?.(ALBUM);
      Store?.setCurrentAlbum?.(album);
    };

    const list = (): JSX.Element | JSX.Element[] | undefined => {
      switch (viewType) {
        case BROWSE_GENRES:
          return categories?.map(item => <BrowseViewItem key={item.id} item={item} getlist={() => getCategoriesPlaylist(item)} set />);
        case BROWSE_GENRES_PLAYLISTS:
          return categoriesPlaylists?.map((item, i) => (
            <BrowseViewItem key={`${i}${item.id}`} item={item} getlist={() => getPlaylistSongs(item)} set={false} />
          ));
        case BROWSE_NEW_RELEASES:
          return newReleases?.map(item => <BrowseViewItem key={item.id} item={item} getlist={() => artistSongsAction(item)} set={false} />);
        case BROWSE_FEATURED:
          return featured?.map(item => <BrowseViewItem key={item.id} item={item} getlist={() => getPlaylistSongs(item)} set={false} />);
        default:
          return <></>;
      }
    };

    return (
      <>
        <SimpleBar className="scroll-2">
          <ul className="browse-view">{list()}</ul>
        </SimpleBar>
      </>
    );
  })
);

export default BrowseView;
