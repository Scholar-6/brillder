import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './app.css';
import '../assets/css/icomoon.css';

import NewBrick from '../build/newBrick/newBrick';
import MainPage from '../build/mainPage/mainPage';
import BricksListPage from '../build/bricksListPage/bricksListPage';
import InvestigationBuildPage from '../build/investigationBuildPage/investigationBuildPage'
import LoginPage from '../loginPage/loginPage';
import RegisterPage from '../registerPage/registerPage';
import PreLoginPage from '../preLoginPage/preLoginPage';
import LogoPage from '../logoPage/logoPage';
import AuthRoute from './AuthRoute';
import PrivateRoute from './privateRoute';

const App: React.FC = (props: any) => {
  let history = useHistory();

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    history.push("/pre-login");
    return Promise.reject(error);
  });

  const theme = React.useMemo(() =>
    createMuiTheme({
      palette: {
        primary: { main: "#0B3A7E" }
      }
    }),
    [],
  );

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <PrivateRoute path="/build/new-brick" component={NewBrick} />
        <PrivateRoute path="/build/brick/:brickId" component={InvestigationBuildPage} />
        <PrivateRoute path="/build/bricks-list" component={BricksListPage} />
        <AuthRoute path="/pre-login" component={PreLoginPage} />
        <AuthRoute path="/login" exact component={LoginPage} />
        <AuthRoute path="/register" exact component={RegisterPage} />
        <PrivateRoute path="/build" component={MainPage} />
        <Route path="/logo-page" component={LogoPage} />
        <PrivateRoute path="/" component={MainPage} />
      </Switch>
    </ThemeProvider>
  );
}

export default App