import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { authReducer } from './auth';
import { alertReducer } from './alerts';
import {chatReducer} from './chat';

// reducers.js
import { connectRouter } from 'connected-react-router'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  auth: authReducer,
  alert: alertReducer,
  routing: routerReducer,
  chat: chatReducer
})
export default createRootReducer
