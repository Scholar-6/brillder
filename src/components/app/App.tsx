import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './app.scss';
import '../../assets/fonts/icomoon/style.css';

import Pallet from '../play/pallet/Pallet';
import VersionLabel from 'components/baseComponents/VersionLabel';
import Dashboard from '../play/dashboard/Dashboard';
import PlayBrickRouting from '../play/brick/PlayBrickRouting';
import Proposal from '../build/proposal/Proposal';
import MainPage from '../build/mainPage/mainPage';
import BricksListPage from '../build/bricksListPage/bricksListPage';
import BackToWorkPage from '../build/backToWorkPage/BackToWork';
import UsersListPage from '../build/users/UsersList';
import InvestigationBuildPage from '../build/investigationBuildPage/investigationBuildPage'
import LoginPage from '../authPages/loginPage/loginPage';
import ChooseLoginPage from '../authPages/chooseLoginPage/ChooseLoginPage';
import ChooseUserPage from '../authPages/chooseUserPage/ChooseUserPage';
import LogoPage from '../logoPage/logoPage';
import SubmitBrickPage from '../build/investigationBuildPage/submit/SubmitPage';
import PublishBrickPage from '../build/investigationBuildPage/publish/PublishPage';
import SignUpFinished from '../authPages/signUpFinished/SignUpFinished';
import UserProfilePage from '../build/userProfilePage/UserProfile';

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
        <StudentRoute path="/play/dashboard" component={Dashboard} />

        <BuildRoute path="/build/new-brick" component={Proposal} />
        <BuildRoute exact path="/build/brick/:brickId/build/investigation/submit" component={SubmitBrickPage} />
        <BuildRoute exact path="/build/brick/:brickId/build/investigation/publish" component={PublishBrickPage} />
        <BuildRoute path="/build/brick/:brickId" component={InvestigationBuildPage} />
        <BuildRoute path="/build/bricks-list" component={BricksListPage} />
        <BuildRoute path="/build/back-to-work" component={BackToWorkPage} />
        <BuildRoute path="/build/users" component={UsersListPage} />
        <BuildRoute path="/build/user-profile/:userId" component={UserProfilePage} />
        <BuildRoute path="/build/user-profile" component={UserProfilePage} />
        <BuildRoute path="/build" component={MainPage} />

        <AuthRoute path="/choose-login" component={ChooseLoginPage} />
        <AuthRoute path="/choose-user" component={ChooseUserPage} />
        <AuthRoute path="/login" exact component={LoginPage} />
        <AuthRoute path="/sign-up-success" exact component={SignUpFinished} />

        <Route path="/logo-page" component={LogoPage} />
        <Route component={AuthRedirectRoute} />
      </Switch>
      <VersionLabel />
    </ThemeProvider>
  );
}

export default App
