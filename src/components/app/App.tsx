import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { connect } from 'react-redux';
import { isMobile, isIPad13, isTablet } from 'react-device-detect';

import './app.scss';
import actions from "redux/actions/auth";
import GlobalFailedRequestDialog from "components/baseComponents/failedRequestDialog/GlobalFailedRequestDialog";

import VersionLabel from 'components/baseComponents/VersionLabel';
import ViewAll from '../viewAllPage/ViewAll';
import MobileCategory from '../viewAllPage/MobileCategory';
import PlayBrickRouting from '../play/PlayBrickRouting';
import PlayPreviewRouting from 'components/playPreview/PreviewBrickRouting';
import Proposal from 'components/build/proposal/Proposal';
import MainPage from 'components/mainPage/mainPage';
import BackToWorkPage from '../backToWorkPage/BackToWork';
import AssignmentsPage from '../assignmentsPage/AssignmentsPage';
import UsersListPage from '../userManagement/UsersList';
import InvestigationBuildPage from 'components/build/investigationBuildPage'
import LoginPage from '../loginPage/loginPage';
import ResetPasswordPage from '../resetPasswordPage/ResetPasswordPage';
import ActivateAccountPage from '../activateAccountPage/activateAccountPage';
import EmailActivateAccountPage from '../activateAccountPage/emailActivateAccountPage';
import ManageClassrooms from 'components/teach/manageClassrooms/ManageClassrooms';
import ClassStatisticsPage from 'components/teach/statistics/ClassStatisticsPage';
import PostPlay from 'components/postPlay/PostPlay';
import Library from 'components/library/Library';

import UserProfilePage from 'components/userProfilePage/UserProfile';
import UserPreferencePage from 'components/onboarding/userPreferencePage/UserPreferencePage';
import UsernamePage from 'components/onboarding/usernamePage/UsernamePage';

import AuthRoute from './AuthRoute';
import BuildRoute from './BuildRoute';
import BuildBrickRoute from './BuildBrickRoute';
import StudentRoute from './StudentRoute';
import AuthRedirectRoute from './AuthRedirectRoute';
import AllUsersRoute from './AllUsersRoute';
import UnauthorizedRoute from './UnauthorizedRoute';

import BrickWrapper from './BrickWrapper';

import { setBrillderTitle } from 'components/services/titleService';
import { setupZendesk } from 'services/zendesk';
import map from 'components/map';
import RotateInstruction from 'components/baseComponents/rotateInstruction/RotateInstruction';
import TeachPage from 'components/teach/assignments/TeachPage';
import Terms from 'components/onboarding/terms/Terms';
import PlayPreviewRoute from './PlayPreviewRoute';
import EmailLoginPage from 'components/loginPage/EmailLoginPage';
import SelectSubjectPage from 'components/onboarding/selectSubjectPage/SelectSubjectPage';
import PublicTerms from 'components/terms/PublicTerms';

interface AppProps {
  setLogoutSuccess(): void;
}

const App: React.FC<AppProps> = props => {
  setBrillderTitle();
  const location = useLocation();
  const [zendeskCreated, setZendesk] = React.useState(false);
  const [orientation, setOrientation] = React.useState('');

  useEffect(() => {
    window.addEventListener("orientationchange", (event:any) => {
      setOrientation(event.target.screen.orientation ? event.target.screen.orientation.type : event.target.orientation);
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
        props.setLogoutSuccess();
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

  const landscape = '/^landscape-.+$/';
  if (!isTablet && !isIPad13 && isMobile) {
    // Apple does not seem to have the window.screen api so we have to use deprecated window.orientation instead.
    if (window.screen.orientation && window.screen.orientation.type.match(landscape) || window.orientation === 90 || window.orientation === -90) {
      return <RotateInstruction />;
    }
  }

  // tablet or ipad show in landscape
  if (isTablet || isIPad13) {
    if (window.screen.orientation && window.screen.orientation.type.match(landscape) || window.orientation === 90 || window.orientation === -90) {
    } else {
      return <RotateInstruction />;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {/* all page routes are here order of routes is important */}
      <Switch>
        <UnauthorizedRoute path={map.AllSubjects} component={ViewAll} />
        <UnauthorizedRoute path="/play/dashboard/:categoryId" component={MobileCategory} />
        <UnauthorizedRoute path="/play/brick/:brickId" component={BrickWrapper} innerComponent={PlayBrickRouting} />
        <UnauthorizedRoute path={map.ViewAllPage} component={ViewAll} />

        <StudentRoute path="/my-library" component={Library} />
        <StudentRoute path="/post-play/brick/:brickId/:userId" component={PostPlay} />

        <BuildRoute path={map.ManageClassroomsTab} component={ManageClassrooms} location={location} />
        <BuildRoute path={map.TeachAssignedTab} component={TeachPage} location={location} />
        <BuildRoute path="/classroom-stats/:classroomId" component={ClassStatisticsPage} location={location} />

        <PlayPreviewRoute path="/play-preview/brick/:brickId" component={PlayPreviewRouting} location={location} />
        <BuildBrickRoute
          path={[
            "/build/brick/:brickId/investigation/question-component/:questionId",
            "/build/brick/:brickId/investigation/question-component",
            "/build/brick/:brickId/investigation/question/:questionId",
            "/build/brick/:brickId/investigation/question",
            "/build/brick/:brickId"
          ]}
          component={InvestigationBuildPage}
          location={location}
        />
        <BuildRoute path={map.ProposalBase} component={Proposal} location={location} />
        <BuildRoute path="/build/brick/:brickId" component={Proposal} location={location} />
        <BuildBrickRoute path="/build/brick/:brickId" component={InvestigationBuildPage} location={location} />
        <BuildRoute path={map.BackToWorkPage} component={BackToWorkPage} location={location} />
        <BuildRoute path={map.AssignmentsPage} component={AssignmentsPage} location={location} />
        <BuildRoute path="/users" component={UsersListPage} location={location} />
        <BuildRoute path={map.UserProfile + ':userId'} component={UserProfilePage} location={location} />
        <BuildRoute path="/home" component={MainPage} location={location} />

        <AllUsersRoute path={map.UserProfile} component={UserProfilePage} />
        <AllUsersRoute path={map.UserPreference} component={UserPreferencePage} isPreferencePage={true} />
        <AllUsersRoute path={map.SetUsername} component={UsernamePage} />
        <AllUsersRoute path={map.SelectSubjectPage} component={SelectSubjectPage} />

        <AuthRoute path={map.Login + '/email'} component={EmailLoginPage} />
        <AuthRoute path="/login/:privacy" component={LoginPage} />
        <AuthRoute path={map.Login} component={LoginPage} />
        <AuthRoute path="/resetPassword" component={ResetPasswordPage} />
        <AuthRoute path={map.ActivateAccount + '/email'} component={EmailActivateAccountPage} />
        <AuthRoute path={map.ActivateAccount} component={ActivateAccountPage} />
        <Route path={map.TermsPage} component={Terms} />
        <Route path="/terms" component={PublicTerms} />

        <Route component={AuthRedirectRoute} />
      </Switch>
      <VersionLabel />
      <GlobalFailedRequestDialog />
    </ThemeProvider>
  );
}

const mapDispatch = (dispatch: any) => ({
  setLogoutSuccess: () => dispatch(actions.setLogoutSuccess()),
});

export default connect(null, mapDispatch)(App);
