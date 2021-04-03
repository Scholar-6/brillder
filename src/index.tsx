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
import { isIPad13, isMobileSafari, isSafari, isTablet } from 'react-device-detect';
import { isPhone } from 'services/phone';

moment.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: 'a few seconds',
    ss: '%d seconds',
    m: "1 min",
    mm: "%d mins",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    w: "a week",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
});

const MobileTheme = React.lazy(() => import('components/app/MobileTheme'));
const TabletTheme = React.lazy(() => import('components/app/TabletTheme'));
const DesktopTheme = React.lazy(() => import('components/app/DesktopTheme'));
const SafariTheme = React.lazy(() => import('components/app/SafariTheme'));

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <React.Suspense fallback={<></>}>
        {isPhone() ? <MobileTheme /> : (isTablet || isIPad13) ? <TabletTheme /> : <DesktopTheme />}
        {(isSafari || isMobileSafari) && <SafariTheme />}
      </React.Suspense>
      <App />
    </Provider>
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
