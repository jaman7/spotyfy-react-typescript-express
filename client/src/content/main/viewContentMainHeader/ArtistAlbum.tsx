import LazyImage from 'shared/components/LazyImage';
import { inject, observer } from 'mobx-react';
import { IStoreProps, StoreName } from 'core/stores/Store.model';

const { STORE } = StoreName;

const ArtistAlbum = inject(STORE)(
  observer((props: IStoreProps & { [name: string]: any }) => {
    const { getlist, item, set } = props || {};

    return (
      <li role="presentation" onClick={() => getlist(item)} className="category-item" key={item.id}>
        <div className="category-image">
          <LazyImage src={item.icons ? item.icons[0].url : item.images[0].url} className="img-fluid effect lazyload" />
          {set ? <p className="category-name">{item.name}</p> : <></>}
        </div>
      </li>
    );
  })
);

export default ArtistAlbum;
