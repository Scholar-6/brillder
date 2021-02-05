import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// I think this is redundant until the service worker is registered below...
import * as serviceWorker from './serviceWorker';
import App from './components/app/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import moment from 'moment';

import store from 'redux/store';

moment.updateLocale('en', {
  relativeTime : {
      future: "in %s",
      past:   "%s ago",
      s  : 'a few seconds',
      ss : '%d seconds',
      m:  "1 min",
      mm: "%d mins",
      h:  "an hour",
      hh: "%d hours",
      d:  "a day",
      dd: "%d days",
      w:  "a week",
      M:  "a month",
      MM: "%d months",
      y:  "a year",
      yy: "%d years"
  }
});

console.log('before ReactDOM');

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App/>
    </Provider>
  </Router>,
  document.getElementById('root')
);

console.log('after ReactDOM');

serviceWorker.unregister();
