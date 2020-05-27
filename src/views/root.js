import React from 'react';
import { Provider } from 'react-redux';
import { Router, Switch, Route, Link } from 'react-router-dom';
import { getRoutes } from './routes';
// import App from './app';
import { PropTypes } from 'prop-types';
import App from './app';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import { ConnectedRouter } from 'connected-react-router'

import Dashboard from './pages/chat/dashboard'
import UserName from 'views/pages/sign-up/username'

import {withRouter} from 'react-router-dom'

console.log("init root")

const AppWithRouter = withRouter(App)
export default function Root({ history, store }) {
  return (

    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Router history={history} >
          {/* <Switch> */}

          <AppWithRouter>
            <Route path="/chat" component={Dashboard}>
              {/* <Home /> */}
            </Route>
            <Route path="/sign-in" component={SignIn}>
              {/* <SignIn></SignIn> */}
            </Route>
            <Route path="/sign-up" component={SignUp}>
              {/* <SignUp></SignUp> */}
            </Route>
            <Route path="/username" component={UserName}>
              {/* <SignUp></SignUp> */}
            </Route>
          </AppWithRouter>


          {/* </Switch> */}
        </Router>
      </ConnectedRouter>

    </Provider >
  );
}

Root.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};
// console.log("finish root ")

