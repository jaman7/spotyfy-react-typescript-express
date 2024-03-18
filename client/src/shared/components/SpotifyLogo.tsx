import { IStoreProps, StoreName } from 'core/stores/Store.model';
import { inject, observer } from 'mobx-react';

const { STORE } = StoreName;

const SpotifyLogo = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store: { user } = {} } = props || {};

    const imgSrc = user?.id ? user?.images?.[0]?.url : 'assets/img/spotify.png';

    return (
      <>
        <img alt="user" className="img-fluid user-image" src={imgSrc} />
      </>
    );
  })
);

export default SpotifyLogo;
