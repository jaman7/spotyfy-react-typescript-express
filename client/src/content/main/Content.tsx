import { useEffect, useRef } from 'react';
import Header from './header/Header';
import MainHeader from './viewContentMainHeader/MainHeader';
import { inject, observer } from 'mobx-react';
import { IStoreProps, StoreName } from 'core/stores/Store.model';
import SongList from './viewContent/SongList';

const { STORE } = StoreName;

const Content = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};
    const { tracks, viewType, isLoading, setTableMaxHeight } = Store || {};

    const container = useRef<HTMLDivElement | null>(null);
    const containerMainHeader = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      setTableMaxHeight?.((container?.current?.clientHeight ?? 0) - 64 - (containerMainHeader?.current?.clientHeight ?? 0) - 60);
    }, [viewType, tracks, isLoading]);

    return (
      <div className="content" ref={container}>
        <div className="d-flex">
          <Header />
        </div>
        <div className="d-flex" ref={containerMainHeader}>
          <MainHeader />
        </div>
        <div className="d-block flex-1">
          <SongList />
        </div>
      </div>
    );
  })
);

export default Content;
