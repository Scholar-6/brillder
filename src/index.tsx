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
import { isMobile } from 'react-device-detect';

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

const MobileTheme = React.lazy(() => import('components/app/MobileTheme'));
const DesktopTheme = React.lazy(() => import('components/app/DesktopTheme'));

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <React.Suspense fallback={<></>}>
        {isMobile ? <MobileTheme /> : <DesktopTheme />}
      </React.Suspense>
      <App/>
    </Provider>
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
