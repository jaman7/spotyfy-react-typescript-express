import { inject, observer } from 'mobx-react';
import { IStoreProps, StoreName } from 'core/stores/Store.model';
import { ViewType } from 'shared/enums/viewTypeEnum';
import SimpleBar from 'simplebar-react';
import ArtistAlbum from './ArtistAlbum';

const { STORE } = StoreName;
const { ARTISTS, ALBUM, ALBUMS } = ViewType;

const ArtistsAlbums = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};
    const { viewType, artists, albums } = Store || {};

    const getArtistAlbums = (item: any): void => {
      Store?.fetchAlbum?.(item?.id);
      Store?.updateHeaderTitle?.(ALBUMS);
      Store?.updateViewType?.(ALBUMS);
    };

    const getAlbum = (item: any): void => {
      Store?.fetchAlbum?.(item?.id);
      Store?.updateHeaderTitle?.(ALBUM);
      Store?.updateViewType?.(ALBUM);
    };

    const list = (): JSX.Element | JSX.Element[] | undefined => {
      switch (viewType) {
        case ARTISTS:
          return artists?.map(item => <ArtistAlbum key={item.id} item={item} getlist={() => getArtistAlbums(item)} set />);
        case ALBUMS:
          return albums?.map((item, i) => <ArtistAlbum key={`${i}${item.id}`} item={item} getlist={() => getAlbum(item)} set={false} />);
        default:
          return <></>;
      }
    };

    return (
      <SimpleBar className="scroll-2">
        <ul className="browse-view">{list()}</ul>
      </SimpleBar>
    );
  })
);

export default ArtistsAlbums;
