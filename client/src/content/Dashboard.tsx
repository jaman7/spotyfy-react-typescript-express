import { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { IStore, StoreName } from 'core/stores/Store.model';
import Sidebar from './sidebar/Sidebar';
import AudioPlayer from './main/player/AudioPlayer';
import useAuth from 'core/auth/useAuth';
import Content from './main/Content';

const { STORE } = StoreName;

interface IProps {
  code?: string;
  Store?: IStore;
}

const Dashboard = inject(STORE)(
  observer((props: IProps) => {
    const { code, Store } = props || {};
    const accessToken = useAuth(code as string, Store);

    useEffect(() => {
      if (!accessToken) return;
      Store?.fetchUser?.();
    }, [accessToken]);

    return (
      <div className="dasboard">
        <div className="dasboard__view">
          <Sidebar />
          <Content />
        </div>

        <div className="footer">
          <AudioPlayer />
        </div>
      </div>
    );
  })
);

export default Dashboard;
