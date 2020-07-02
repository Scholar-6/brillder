import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// I think this is redundant until the service worker is registered below...
import * as serviceWorker from './serviceWorker';
import App from './components/app/App';
import { BrowserRouter as Router } from 'react-router-dom';
// @ts-ignore
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

import reducer from 'redux/reducers/index';
import actions from 'redux/actions/auth';

const socket = io(process.env.REACT_APP_BACKEND_HOST ?? "");
let socketIoMiddleware = createSocketIoMiddleware(socket, ["server/"]);

const store = createStore(reducer, applyMiddleware(thunkMiddleware, socketIoMiddleware));
store.dispatch(actions.isAuthorized());

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App/>
    </Provider>
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
