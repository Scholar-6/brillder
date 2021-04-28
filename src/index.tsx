import React from 'react';
//@ts-ignore
import ReactDOM from 'react-dom';
import './index.scss';
// I think this is redundant until the service worker is registered below...
import * as serviceWorker from './serviceWorker';
import App from './components/app/App';
//@ts-ignore
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <App/>
  </Router>,
  document.getElementById('root')
);

console.log(ReactDOM);

serviceWorker.unregister();
