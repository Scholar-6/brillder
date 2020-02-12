import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
// @ts-ignore
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import './app.css';
import '../../font-numbers/style.css'
import reducer from '../../redux/reducers/index';
import PrivateRoute from './privateRoute';

import MainPage from '../mainPage/mainPage';
import ProFormaPage from '../proFormaPage/proFormaPage';
import BricksListPage from '../bricksListPage/bricksListPage';
import InvestigationBuildPage from '../investigationBuildPage/investigationBuildPage'
import LoginPage from '../loginPage/loginPage';
import RegisterPage from '../registerPage/registerPage';
import PreLoginPage from '../preLoginPage/preLoginPage';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

const App: React.FC = () => {
  const theme = React.useMemo(() =>
    createMuiTheme({
      palette: {
        primary: { main: "#0B3A7E" }
      }
    }),
    [],
  );

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/pre-login" component={PreLoginPage}></Route>
          <Route path="/brick/:brickId" component={InvestigationBuildPage}/>
          <PrivateRoute path="/brick-create" exact component={ProFormaPage}/>
          <PrivateRoute path="/brick-create/:brickId" exact component={ProFormaPage}/>
          <PrivateRoute path="/bricks-list" component={BricksListPage}/>
          <Route path="/login" exact component={LoginPage}></Route>
          <Route path="/register" exact component={RegisterPage}></Route>
          <PrivateRoute path="/" component={MainPage} />
        </Switch>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
