import PlayButton from 'shared/components/Playbutton';
import { inject, observer } from 'mobx-react';
import LazyImage from 'shared/components/LazyImage';
import BrowseViewMain from './BrowseViewMain';
import { IPlaylist, IStoreProps, StoreName } from 'core/stores/Store.model';
import { ViewType } from 'shared/enums/viewTypeEnum';
import ArtistsAlbums from './ArtistsAlbums';

const { STORE } = StoreName;
const { BROWSE, MY_PLAYLISTS, MY_ALBUMS, ARTIST, ARTISTS, ALBUM, ALBUMS, PLAYLIST } = ViewType;

const MainHeader = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};
    const { viewType, currentPlaylist } = Store || {};

    const artistName = (currentPlaylist: IPlaylist): string => currentPlaylist?.artists?.[0]?.name ?? '';

    return (
      <>
        {viewType?.includes(BROWSE) && <BrowseViewMain />}

        {viewType === MY_PLAYLISTS || viewType === MY_ALBUMS || viewType === PLAYLIST || viewType === ARTIST || viewType === ALBUM ? (
          <div className="col-12 main-header mb-3">
            <div className="d-flex align-items-end">
              <LazyImage src={currentPlaylist?.images?.[0]?.url ?? null} className="img-fluid effect lazyload" />
              <div className="info">
                <h3 className="info-title">{currentPlaylist?.name}</h3>
                {artistName?.(currentPlaylist as IPlaylist) ? (
                  <h3 className="mb-3">{artistName?.(currentPlaylist as IPlaylist)}</h3>
                ) : (
                  <></>
                )}
                <PlayButton />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {(viewType === ARTISTS || viewType === ALBUMS) && <ArtistsAlbums />}
      </>
    );
  })
);

export default MainHeader;
