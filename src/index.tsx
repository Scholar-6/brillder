import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// I think this is redundant until the service worker is registered below...
import * as serviceWorker from './serviceWorker';
import App from './components/app/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from 'redux/store';

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App/>
    </Provider>
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
