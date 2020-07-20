import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// I think this is redundant until the service worker is registered below...
import * as serviceWorker from './serviceWorker';
import App from './components/app/App';
import { BrowserRouter as Router } from 'react-router-dom';
// @ts-ignore
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducer from 'redux/reducers/index';
import actions from 'redux/actions/auth';

import { socketIoMiddleware } from 'socket/socket';

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
