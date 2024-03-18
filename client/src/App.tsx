import Dashboard from 'content/Dashboard';
import Login from 'core/auth/Login';
import { inject, observer } from 'mobx-react';
import { IStoreProps, StoreName } from 'core/stores/Store.model';
import { useEffect, useState } from 'react';
import './i18n';

const { STORE } = StoreName;

const App = inject(STORE)(
  observer((props: IStoreProps) => {
    const { Store } = props || {};

    const [accessToken, setAccessToken] = useState<string>('');

    const code = new URLSearchParams(window.location.search).get('code');

    useEffect(() => {
      if (code !== '') {
        setAccessToken(code as string);
      }
    }, [code]);

    return <>{accessToken || Store?.auth?.accessToken ? <Dashboard code={accessToken as string} /> : <Login />}</>;
  })
);

export default App;
