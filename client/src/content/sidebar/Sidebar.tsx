import { inject, observer } from 'mobx-react';
import Button from 'shared/components/Button';
import { MdOutlineDoubleArrow } from 'react-icons/md';
import ArtWork from './ArtWork';
import { IStoreProps, StoreName } from 'core/stores/Store.model';
import Menu from './Menu';

const { STORE } = StoreName;

const Sidebar = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};
    const { sidebarStatus } = Store || {};

    return (
      <>
        <div className={`sidebar ${sidebarStatus ? 'toggled' : ' '}`}>
          <div className="sidebar-content">
            <div className="d-block">
              <Button
                type="button"
                className={`btn btn-menu ${sidebarStatus ? 'active' : ''}`}
                onClick={() => {
                  Store?.setSidebarStatus?.(sidebarStatus as boolean);
                }}
              >
                <MdOutlineDoubleArrow />
              </Button>
              <Menu />
            </div>
            <ArtWork />
          </div>
        </div>
      </>
    );
  })
);

export default Sidebar;
