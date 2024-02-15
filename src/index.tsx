import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// I think this is redundant until the service worker is registered below...
import * as serviceWorker from './serviceWorker';
import App from './components/app/App';
import { BrowserRouter as Router } from 'react-router-dom';

import { isIPad13, isTablet } from 'react-device-detect';
import { isPhone } from 'services/phone';



const MobileTheme = React.lazy(() => import('components/app/MobileTheme'));
const TabletTheme = React.lazy(() => import('components/app/TabletTheme'));
const DesktopTheme = React.lazy(() => import('components/app/DesktopTheme'));

ReactDOM.render(
  <Router>
    <React.Suspense fallback={<></>}>
      {isPhone() ? <MobileTheme /> : (isTablet || isIPad13) ? <TabletTheme /> : <DesktopTheme />}
    </React.Suspense>
    <App />
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
