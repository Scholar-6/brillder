import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './app.scss';
import GlobalFailedRequestDialog from "components/baseComponents/failedRequestDialog/GlobalFailedRequestDialog";

import VersionLabel from 'components/baseComponents/VersionLabel';
import ViewAll from '../viewAllPage/ViewAll';
import MobileCategory from '../viewAllPage/MobileCategory';
import PlayBrickRouting from '../play/PlayBrickRouting';
import PlayPreviewRouting from 'components/playPreview/PreviewBrickRouting';
import Proposal from 'components/proposal/Proposal';
import MainPage from 'components/mainPage/mainPage';
import BackToWorkPage from '../backToWorkPage/BackToWork';
import UsersListPage from '../userManagement/UsersList';
import InvestigationBuildPage from 'components/build/investigationBuildPage'
import LoginPage from '../loginPage/loginPage';
import UserProfilePage from '../userProfilePage/UserProfile';
import ManageClassrooms from 'components/teach/manageClassrooms/ManageClassrooms';
import ClassStatisticsPage from 'components/teach/statistics/ClassStatisticsPage';
import PostPlay from 'components/postPlay/PostPlay';
import Library from 'components/library/Library';
import UserPreferencePage from 'components/userProfilePage/userPreferencePage/UserPreferencePage';

import AuthRoute from './AuthRoute';
import BuildRoute from './BuildRoute';
import BuildBrickRoute from './BuildBrickRoute';
import StudentRoute from './StudentRoute';
import AuthRedirectRoute from './AuthRedirectRoute';
import AllUsersRoute from './AllUsersRoute';
import UnauthorizedRoute from './UnauthorizedRoute';

import BrickWrapper from './BrickWrapper';

import { setBrillderTitle } from 'components/services/titleService';
import { setupZendesk } from 'components/services/zendesk';
import map from 'components/map';
import { isMobile } from 'react-device-detect';
import RotateInstruction from 'components/baseComponents/rotateInstruction/RotateInstruction';
import TeachPage from 'components/teach/assignments/TeachPage';
import Terms from 'components/terms/Terms';

const App: React.FC = () => {
  setBrillderTitle();
  const history = useHistory();
  const location = useLocation();
  const [zendeskCreated, setZendesk] = React.useState(false);
  const [orientation, setOrientation] = React.useState('');

  useEffect(() => {
    console.log('init');
    window.addEventListener("orientationchange", function(event:any) {
      console.log('orientation changed');
      setOrientation(event.target.screen.orientation.type);
    });
  }, []);

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    let { url } = error.response.config;

    // exception for login, play and view all pages
    if (error.response.status === 401) {
      if (
        url.search('/auth/login/') === -1
        && location.pathname.search('/play/brick/') === -1
        && location.pathname.search('/play/dashboard') === - 1
      ) {
        history.push("/login");
      }
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

  if (isMobile) {
    let orientationType = window.screen.orientation.type;
    console.log(orientationType, orientation);
    if (orientationType === 'landscape-secondary' || orientationType === 'landscape-primary') {
      return <RotateInstruction />;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {/* all page routes are here order of routes is important */}
      <Switch>
        <StudentRoute path="/play/dashboard/:categoryId" component={MobileCategory} />
        <UnauthorizedRoute path="/play/brick/:brickId" component={BrickWrapper} innerComponent={PlayBrickRouting} />
        <UnauthorizedRoute path={map.ViewAllPage} component={ViewAll} />

        <StudentRoute path="/my-library" component={Library} />
        <StudentRoute path="/post-play/brick/:brickId/:userId" component={PostPlay} />

        <BuildRoute path={map.ManageClassroomsTab} component={ManageClassrooms} location={location} />
        <BuildRoute path={map.TeachAssignedTab} component={TeachPage} location={location} />
        <BuildRoute path="/classroom-stats/:classroomId" component={ClassStatisticsPage} location={location} />

        <BuildBrickRoute path="/play-preview/brick/:brickId" component={PlayPreviewRouting} location={location} />
        <BuildRoute path={map.ProposalBase} component={Proposal} location={location} />
        <BuildBrickRoute path="/build/brick/:brickId/investigation/question-component/:questionId" component={InvestigationBuildPage} location={location} />
        <BuildBrickRoute path="/build/brick/:brickId" component={InvestigationBuildPage} location={location} />
        <BuildRoute path={map.BackToWorkPage} component={BackToWorkPage} location={location} />
        <BuildRoute path="/users" component={UsersListPage} location={location} />
        <BuildRoute path="/user-profile/:userId" component={UserProfilePage} location={location} />
        <BuildRoute path="/home" component={MainPage} location={location} />

        <AllUsersRoute path="/user-profile" component={UserProfilePage} />
        <AllUsersRoute path="/user/preference" component={UserPreferencePage} isPreferencePage={true} />

        <AuthRoute path="/login/:privacy" component={LoginPage} />
        <AuthRoute path={map.Login} component={LoginPage} />

        <Route path="/terms" component={Terms} />
        <Route component={AuthRedirectRoute} />
      </Switch>
      <VersionLabel />
      <GlobalFailedRequestDialog />
    </ThemeProvider>
  );
}

export default App;
