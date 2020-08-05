import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './app.scss';

import VersionLabel from 'components/baseComponents/VersionLabel';
import Dashboard from '../play/dashboard/Dashboard';
import MobileCategory from '../play/dashboard/MobileCategory';
import PlayBrickRouting from '../play/brick/PlayBrickRouting';
import PlayPreviewRouting from '../build/playPreview/PreviewBrickRouting';
import Proposal from '../build/proposal/Proposal';
import MainPage from 'components/mainPage/mainPage';
import BackToWorkPage from '../build/backToWorkPage/BackToWork';
import UsersListPage from '../build/users/UsersList';
import InvestigationBuildPage from '../build/investigationBuildPage/investigationBuildPage'
import LoginPage from '../authPages/loginPage/loginPage';
import ChooseLoginPage from '../authPages/chooseLoginPage/ChooseLoginPage';
import SubmitBrickPage from '../build/investigationBuildPage/submit/SubmitPage';
import PublishBrickPage from '../build/investigationBuildPage/publish/PublishPage';
import UserProfilePage from '../build/userProfilePage/UserProfile';

import AuthRoute from './AuthRoute';
import BuildRoute from './BuildRoute';
import StudentRoute from './StudentRoute';
import AuthRedirectRoute from './AuthRedirectRoute';
import AllUsersRoute from './AllUsersRoute';

import BrickWrapper from './BrickWrapper';

import { setBrillderTitle } from 'components/services/titleService';
import { setupZendesk } from 'components/services/zendesk';
import map from 'components/map';


const App: React.FC = (props: any) => {
  setBrillderTitle();
  const history = useHistory();
  const location = useLocation();
  const [zendeskCreated, setZendesk] = React.useState(false);

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    let { url } = error.response.config;
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

  setupZendesk(location, zendeskCreated, setZendesk);

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

  return (
    <ThemeProvider theme={theme}>
      {/* all page routes are here order of routes is important */}
      <Switch>
        <StudentRoute path="/play/brick/:brickId" component={BrickWrapper} innerComponent={PlayBrickRouting} />
        <StudentRoute path="/play/dashboard/:categoryId" component={MobileCategory} />
        <StudentRoute path="/play/dashboard" component={Dashboard} />

        <BuildRoute path="/play-preview/brick/:brickId" component={PlayPreviewRouting} location={location} />
        <BuildRoute path={map.ProposalBase} component={Proposal} location={location} />
        <BuildRoute exact path="/build/brick/:brickId/build/investigation/submit" component={SubmitBrickPage} location={location} />
        <BuildRoute exact path="/build/brick/:brickId/build/investigation/publish" component={PublishBrickPage} location={location} />
        <BuildRoute path="/build/brick/:brickId" component={InvestigationBuildPage} location={location} />
        <BuildRoute path="/back-to-work" component={BackToWorkPage} location={location} />
        <BuildRoute path="/users" component={UsersListPage} location={location} />
        <BuildRoute path="/user-profile/:userId" component={UserProfilePage} location={location} />
        <AllUsersRoute path="/user-profile" component={UserProfilePage} />
        <BuildRoute path="/home" component={MainPage} location={location} />

        <AuthRoute path="/choose-login" component={ChooseLoginPage} />
        <AuthRoute path="/login" exact component={LoginPage} />

        <Route component={AuthRedirectRoute} />
      </Switch>
      <VersionLabel />
    </ThemeProvider>
  );
}

export default App
