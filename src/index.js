import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { createBrowserHistory } from 'history';

import { initAuth } from './core/auth';
import Root from './views/root';
import './styles/core.scss';
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router' // react-router v4/v5

import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from 'core/store'
console.log("/index.js start")
const store = configureStore();
// const syncedHistory = syncHistoryWithStore(createBrowserHistory(), store);
const rootElement = document.getElementById('root');
// history.replace("/sign-in")
function render() {
  ReactDOM.render(
    <AppContainer>
      <Root history={history} store={store} />
    </AppContainer>,
    rootElement
  );
}

// ========================================================
// Render
// ========================================================
console.log("index printint store")
console.log({store})
initAuth(store.dispatch)
  .then(() => render(Root))
  .catch(error => console.error(error)); // eslint-disable-line no-console
console.log("/index.js app finish")
