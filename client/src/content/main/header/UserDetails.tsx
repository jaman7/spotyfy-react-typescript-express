import { inject, observer } from 'mobx-react';
import { IStoreProps, StoreName } from 'core/stores/Store.model';

const { STORE } = StoreName;

const UserDetails = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store: { user = {} } = {} } = props || {};

    const displayName = user ? user?.display_name : '';

    return (
      <>
        <div className="user-details">
          <span className="user-name">{displayName}</span>
        </div>
      </>
    );
  })
);

export default UserDetails;
