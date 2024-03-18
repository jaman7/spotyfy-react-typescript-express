import { createRoot } from 'react-dom/client';
import { Provider } from 'mobx-react';
import App from 'App';
import Store from 'core/stores/Store';
import './assets/scss/main.scss';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Provider Store={Store}>
    <App />
  </Provider>
);
