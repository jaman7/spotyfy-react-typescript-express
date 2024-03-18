import { inject, observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import BrowseView from './BrowseView';
import { IStoreProps, StoreName } from 'core/stores/Store.model';
import { ViewType, ViewTypes } from 'shared/enums/viewTypeEnum';

const { STORE } = StoreName;
const { BROWSE, BROWSE_GENRES_PLAYLISTS, BROWSE_GENRES, BROWSE_NEW_RELEASES, BROWSE_FEATURED } = ViewType;

interface IBrowseSectionMenu {
  name?: string;
  viewType?: string;
}

const BrowseViewMain = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};
    const { title, viewType, updateViewType, updateHeaderTitle } = Store || {};

    const [submenuIndex, setSubmenuIndex] = useState<number>(0);

    useEffect(() => {
      switch (viewType) {
        case BROWSE_GENRES:
          Store?.setCurrentTracks?.([]);
          Store?.fetchCategories?.();
          break;
        case BROWSE_NEW_RELEASES:
          Store?.setCurrentTracks?.([]);
          Store?.fetchNewReleases?.();
          break;
        case BROWSE_FEATURED:
          Store?.setCurrentTracks?.([]);
          Store?.fetchFeatured?.();
          break;
        default:
          break;
      }
    }, [submenuIndex]);

    const renderBrowseMenu = () => {
      const browseMenu: IBrowseSectionMenu[] = [
        { name: 'Genres', viewType: BROWSE_GENRES },
        { name: 'New Releases', viewType: BROWSE_NEW_RELEASES },
        { name: 'Featured', viewType: BROWSE_FEATURED },
      ];

      return browseMenu?.map((item: IBrowseSectionMenu, i: number) => {
        return (
          <li
            role="presentation"
            key={item.name}
            className={viewType === item?.viewType ? 'active' : '' || (viewType === BROWSE_GENRES_PLAYLISTS && i === 0) ? 'active' : ''}
            onClick={() => {
              updateViewType?.(item?.viewType as ViewTypes);
              updateHeaderTitle?.(BROWSE as ViewTypes);
              setSubmenuIndex(i);
            }}
          >
            <span>{item.name}</span>
          </li>
        );
      });
    };

    return (
      <div className="col-12 main-header mb-3">
        <h3 className="main-header__title">{title}</h3>
        <div className="menu">
          <ul className="menu-browse-headers">{renderBrowseMenu()}</ul>
        </div>
        <BrowseView />
      </div>
    );
  })
);

export default BrowseViewMain;
