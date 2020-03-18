import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './app.css';
import '../../assets/fonts/icomoon/style.css';

import Pallet from '../play/pallet/Pallet';
import Dashboard from '../manage/dashboard/Dashboard';
import PlayBrickRouting from '../play/brick/PlayBrickRouting';
import NewBrick from '../build/newBrick/newBrick';
import MainPage from '../build/mainPage/mainPage';
import BricksListPage from '../build/bricksListPage/bricksListPage';
import InvestigationBuildPage from '../build/investigationBuildPage/investigationBuildPage'
import LoginPage from '../loginPage/loginPage';
import RegisterPage from '../registerPage/registerPage';
import ChooseLoginPage from '../chooseLoginPage/ChooseLoginPage';
import ChooseUserPage from '../chooseUserPage/ChooseUserPage';
import LogoPage from '../logoPage/logoPage';

import AuthRoute from './AuthRoute';
import BuildRoute from './BuildRoute';
import StudentRoute from './StudentRoute';
import AuthRedirectRoute from './AuthRedirectRoute';


const App: React.FC = (props: any) => {
  let history = useHistory();

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    let {url} = error.response.config;
    if (url.search('/auth/login/') === -1) {
      history.push("/choose-user");
    }
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
        <StudentRoute path="/play/brick/:brickId" component={PlayBrickRouting} />
        <StudentRoute path="/play/pallet/:palletName" component={Pallet} />
        <StudentRoute path="/manage/dashboard" component={Dashboard} />

        <BuildRoute path="/build/new-brick" component={NewBrick} />
        <BuildRoute path="/build/brick/:brickId" component={InvestigationBuildPage} />
        <BuildRoute path="/build/bricks-list" component={BricksListPage} />
        <BuildRoute path="/build" component={MainPage} />

        <AuthRoute path="/choose-login" component={ChooseLoginPage} />
        <AuthRoute path="/choose-user" component={ChooseUserPage} />
        <AuthRoute path="/login" exact component={LoginPage} />
        <AuthRoute path="/register" exact component={RegisterPage} />

        <Route path="/logo-page" component={LogoPage} />
        <AuthRedirectRoute />
      </Switch>
    </ThemeProvider>
  );
}

export default App
