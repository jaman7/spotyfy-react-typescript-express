import { IStore, StoreName } from 'core/stores/Store.model';
import { inject, observer } from 'mobx-react';
import LazyImage from 'shared/components/LazyImage';

const { STORE } = StoreName;

interface IProps {
  customClass?: string;
  Store?: IStore;
}

const ArtWork = inject(STORE)(
  observer((props: IProps) => {
    const { Store, customClass } = props || {};
    const { currentTrack } = Store || {};
    const { album, images } = currentTrack || {};
    const albumImage = album?.images?.[0]?.url ?? images?.[0]?.url;

    return <LazyImage src={albumImage ?? null} className={`img-fluid effect lazyload ${customClass}`} />;
  })
);

export default ArtWork;
