import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './app.scss';
import '../../assets/fonts/icomoon/style.css';

import VersionLabel from 'components/baseComponents/VersionLabel';
import Dashboard from '../play/dashboard/Dashboard';
import MobileCategory from '../play/dashboard/MobileCategory';
import PlayBrickRouting from '../play/brick/PlayBrickRouting';
import PlayPreviewRouting from '../build/playPreview/PreviewBrickRouting';
import Proposal from '../build/proposal/Proposal';
import MainPage from '../build/mainPage/mainPage';
import BricksListPage from '../build/bricksListPage/bricksListPage';
import BackToWorkPage from '../build/backToWorkPage/BackToWork';
import UsersListPage from '../build/users/UsersList';
import InvestigationBuildPage from '../build/investigationBuildPage/investigationBuildPage'
import LoginPage from '../authPages/loginPage/loginPage';
import ChooseLoginPage from '../authPages/chooseLoginPage/ChooseLoginPage';
import SubmitBrickPage from '../build/investigationBuildPage/submit/SubmitPage';
import PublishBrickPage from '../build/investigationBuildPage/publish/PublishPage';
import SignUpFinished from '../authPages/signUpFinished/SignUpFinished';
import UserProfilePage from '../build/userProfilePage/UserProfile';

import AuthRoute from './AuthRoute';
import BuildRoute from './BuildRoute';
import StudentRoute from './StudentRoute';
import AuthRedirectRoute from './AuthRedirectRoute';
import AllUsersRoute from './AllUsersRoute';

import {setBrillderTitle} from 'components/services/titleService';



const App: React.FC = (props: any) => {
  setBrillderTitle();
  let history = useHistory();

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    let {url} = error.response.config;
    if (url.search('/auth/login/') === -1) {
      history.push("/choose-login");
    }
    return Promise.reject(error);
  });

  const theme = React.useMemo(() =>
    createMuiTheme({
      palette: {
        primary: { main: "#0B3A7E" }
      },
      breakpoints: {
        values: {
          xs: 0,
          sm: 760,
          md: 960,
          lg: 1280,
          xl: 1920,
        },
      },
    }),
    [],
  );

  const addZendesk = () => {
    var head = document.getElementsByTagName('head').item(0);
    if (head) {
      
      var script = document.createElement('script');
      script.setAttribute('id', 'ze-snippet');
      script.setAttribute('type', 'text/javascript');
      script.setAttribute(
        'src',
        `https://static.zdassets.com/ekr/snippet.js?key=${
          process.env.REACT_APP_ZENDESK_ID
            ? process.env.REACT_APP_ZENDESK_ID
            : '1415bb80-138f-4547-9798-3082b781844a'
        }`
      );
      head.appendChild(script);
    }
  }

  addZendesk();

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <StudentRoute path="/play/brick/:brickId" component={PlayBrickRouting} />
        <StudentRoute path="/play/dashboard/:categoryId" component={MobileCategory} />
        <StudentRoute path="/play/dashboard" component={Dashboard} />

        <BuildRoute path="/play-preview/brick/:brickId" component={PlayPreviewRouting} />

        <BuildRoute path="/build/new-brick" component={Proposal} />
        <BuildRoute exact path="/build/brick/:brickId/build/investigation/submit" component={SubmitBrickPage} />
        <BuildRoute exact path="/build/brick/:brickId/build/investigation/publish" component={PublishBrickPage} />
        <BuildRoute path="/build/brick/:brickId" component={InvestigationBuildPage} />
        {/*Leaving /build/bricks-list as a route that is useful for admins but not currently used in interface 2/7/2020*/}
        <BuildRoute path="/build/bricks-list" component={BricksListPage} />
        <BuildRoute path="/back-to-work" component={BackToWorkPage} />
        <BuildRoute path="/users" component={UsersListPage} />
        <BuildRoute path="/user-profile/:userId" component={UserProfilePage} />
        <AllUsersRoute path="/user-profile" component={UserProfilePage} />
        <BuildRoute path="/home" component={MainPage} />

        <AuthRoute path="/choose-login" component={ChooseLoginPage} />
        <AuthRoute path="/login" exact component={LoginPage} />
        <AuthRoute path="/sign-up-success" exact component={SignUpFinished} />

        <Route component={AuthRedirectRoute} />
      </Switch>
      <VersionLabel />
    </ThemeProvider>
  );
}

export default App
