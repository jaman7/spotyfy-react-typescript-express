import { useState, useEffect } from 'react';
import axios from 'axios';
import { IAuth, IStore } from 'core/stores/Store.model';

const useAuth = (code?: string, store?: IStore) => {
  const [auth, setAuth] = useState<IAuth>({});

  useEffect(() => {
    axios
      .post(`${process.env.APP_BASE_URL}/login`, {
        code,
      })
      .then(res => {
        const { accessToken, refreshToken, expiresIn } = res?.data || {};
        setAuth({ accessToken, refreshToken, expiresIn });
        window.history.pushState({}, '', '/');
        store?.setAuth?.({ accessToken, refreshToken, expiresIn });
      })
      .catch(() => {
        window.location = '/';
      });
  }, [code]);

  useEffect(() => {
    if (!auth?.refreshToken || !auth?.expiresIn) return;
    const interval = setInterval(
      () => {
        axios
          .post(`${process.env.APP_BASE_URL}/refresh`, {
            refreshToken: auth?.refreshToken,
          })
          .then(res => {
            const { accessToken, expiresIn } = res?.data || {};
            setAuth({ ...auth, accessToken, expiresIn });
            store?.setAuth?.(auth);
          })
          .catch(() => {
            window.location = '/';
          });
      },
      auth?.expiresIn * 100 + 1
    );
  }, [auth?.refreshToken, auth?.expiresIn]);

  return auth?.refreshToken ?? '';
};

export default useAuth;
