import React, { Profiler, useEffect } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { isMobileOnly, isSafari, isTablet } from 'react-device-detect';
import queryString from "query-string";

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
import BackToWorkPagePersonal from '../backToWorkPagePersonal/BackToWork';
import BackToWorkPagePublished from '../backToWorkPagePublished/BackToWork';
import AssignmentsPage from '../assignmentsPage/AssignmentsPage';
import UsersListPage from '../userManagement/UsersList';
import LoginPage from '../loginPage/loginPage';
import ResetPasswordPage from '../resetPasswordPage/ResetPasswordPage';
import ActivateAccountPage from '../activateAccountPage/activateAccountPage';
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
import UnauthorizedRoute from './unauthorized/UnauthorizedRoute';

import BrickWrapper from './BrickWrapper';

import { getBrillderTitle } from 'components/services/titleService';
import { setupZendesk } from 'services/zendesk';
import map, { StripeCredits } from 'components/map';
import RotateInstruction from 'components/baseComponents/rotateInstruction/RotateInstruction';
import TeachPage from 'components/teach/assignments/TeachPage';
import Terms from 'components/onboarding/terms/Terms';
import ThankYouPage from 'components/onboarding/thankYou/ThankYou';
import PlayPreviewRoute from './PlayPreviewRoute';
import EmailLoginPage from 'components/loginPage/EmailLoginPage';
import SelectSubjectPage from 'components/onboarding/selectSubjectPage/SelectSubjectPage';
import PublicTerms from 'components/terms/PublicTerms';
import RotateIPadInstruction from 'components/baseComponents/rotateInstruction/RotateIPadInstruction';
import { isPhone } from 'services/phone';
import { setupMatomo } from 'services/matomo';
import { ReduxCombinedState } from 'redux/reducers';
import { User } from 'model/user';
import { getTerms } from 'services/axios/terms';
import BuildRouter from 'components/build/BuildRouter';
import ProposalBrickRoute from './ProposalBrickRoute';
import StartBuildingPage from 'components/build/StartBuilding/StartBuilding';
import { GetYoutubeClick } from 'localStorage/play';
import StripePage from 'components/stripePage/StripePage';
import LeaderboardPage from 'components/competitions/LeaderboardPage';
import ChoosePlan from 'components/choosePlan/ChoosePlan';
import StripeCreditsPage from 'components/stripeCreditsPage/StripeCreditsPage';

import { GetOrigin, SetOrigin } from 'localStorage/origin';
import { GetLoginRedirectUrl, UnsetLoginRedirectUrl } from 'localStorage/login';
import AdminRoute from './AdminRoute';
import BricksPlayed from 'components/admin/bricksPlayed/BricksPlayed';
import UsersEvents from 'components/admin/usersEvents/UsersEvents';
import ClassesEvents from 'components/admin/classesEvents/ClassesEvents';
import AssignmentEvents from 'components/admin/assignmentEvents/AssignmentEvents';


interface AppProps {
  user: User;
  setLogoutSuccess(): void;
  setReferralId(referralId: string): void;
}

const App: React.FC<AppProps> = props => {
  const history = useHistory();
  const location = useLocation();
  const [iframeFullScreen, setIframe] = React.useState(false);
  const [termsData, setTermsData] = React.useState({
    isLoading: false,
    termsVersion: ''
  });

  const [zendeskCreated, setZendesk] = React.useState(false);
  const isHorizontal = () => {
    // Apple does not seem to have the window.screen api so we have to use deprecated window.orientation instead.
    if (window.orientation && typeof window.orientation === "number" && Math.abs(window.orientation) === 90) {
      return true;
    }
    if (window.screen.orientation && window.screen.orientation.type.includes('/^landscape-.+$/') === true) {
      return true;
    }
    return false;
  };
  const [horizontal, setHorizontal] = React.useState(isHorizontal());

  useEffect(() => {
    document.addEventListener('fullscreenchange', (event: any) => {
      try {
        if (document.fullscreenElement) {
          if (event.target.tagName === 'IFRAME') {
            setIframe(true);
          } else {
            setIframe(false);
          }
        }
      } catch { }
    });

    window.addEventListener("orientationchange", (event: any) => {
      const clicked = GetYoutubeClick();
      if (!clicked) {
        setHorizontal(isHorizontal());
      }
    });

    // download mamoto
    setupMatomo();

    var redirectUrl = GetLoginRedirectUrl();

    if (redirectUrl) {
      UnsetLoginRedirectUrl();
      history.push(redirectUrl);
    }

    /*eslint-disable-next-line*/
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referralId = params.get("referralId");
    if (referralId) {
      props.setReferralId(referralId);
    }
    /*eslint-disable-next-line*/
  }, [location]);

  // lock screen for phone
  if (isPhone()) {
    document.onclick = function (e) {
      /*
      if (document.body.requestFullscreen && !document.fullscreenElement) {
        let res = document.body.requestFullscreen();
        res.then(() => {
          if (window.screen.orientation && window.screen.orientation.lock) {
            window.screen.orientation.lock('portrait').catch((e) => console.log(e));
            console.log('lock screen');
          }
        });
      }*/
    }
  }

  // intercept api errors to prevent redirect.
  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    let { url } = error.response?.config;

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
  

  if (!GetOrigin()) {
    const values = queryString.parse(location.search);
    SetOrigin((values.origin ?? "") as string);
  }

  const theme = React.useMemo(() =>
    createMuiTheme({
      palette: {
        secondary: { main: "#001c58" },
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

  setupZendesk(zendeskCreated, setZendesk);

  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    return Promise.reject(error);
  });

  // If is tablet and portrait tell them to go to landscape
  if (isTablet && !horizontal) {
    return <RotateIPadInstruction />;
  }

  // If is mobile and landscape tell them to go to portrait
  else if (isMobileOnly && horizontal && !iframeFullScreen) {
    if (location.pathname.search('/prep') !== -1 && location.pathname.search('/play/brick') !== -1) {
      // allow rotation on prep
    } else {
      return <RotateInstruction />;
    }
  }

  // get terms version
  if (props.user && props.user.termsAndConditionsAcceptedVersion && !termsData.termsVersion && !termsData.isLoading) {
    setTermsData({ isLoading: true, termsVersion: '' });
    getTerms().then(r => {
      if (r) {
        setTermsData({ isLoading: false, termsVersion: r.lastModifiedDate });
      } else {
        setTermsData({ isLoading: false, termsVersion: '' });
      }
    });
  }

  // redirect if to terms when file updated
  if (termsData.termsVersion && props.user && props.user.termsAndConditionsAcceptedVersion) {
    console.log(termsData.termsVersion, props.user.termsAndConditionsAcceptedVersion);
    if (termsData.termsVersion !== props.user.termsAndConditionsAcceptedVersion) {
      window.location.href = map.TermsOnlyAccept;
    }
  }

  const onRenderCallback = (
    id: any, // the "id" prop of the Profiler tree that has just committed
    phase: any, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration: any, // time spent rendering the committed update
    baseDuration: any, // estimated time to render the entire subtree without memoization
    startTime: any, // when React began rendering this update
    commitTime: any, // when React committed this update
    interactions: any // the Set of interactions belonging to this update
  ) => {
    // if more then 100ms log it.
    if (baseDuration > 100) {
      console.log('heavy: ', id, phase, baseDuration, startTime, actualDuration, commitTime);
    } else if (baseDuration > 75) {
      console.log('medium:', id, phase, baseDuration, startTime, actualDuration, commitTime);
    }
  }

  return (
    <div className={isSafari ? 'root-safari browser-type-container' : 'browser-type-container'}>
      <Helmet>
        <title>{getBrillderTitle()}</title>
      </Helmet>
      <ThemeProvider theme={theme}>
        <Profiler id="app-tsx" onRender={onRenderCallback} >
          {/* all page routes are here order of routes is important */}
          <Switch>
            <AllUsersRoute path={StripeCredits} component={StripeCreditsPage} />
            <AllUsersRoute path="/stripe-subscription/:type" component={StripePage} />
            <UnauthorizedRoute path={map.SubjectCategories} component={ViewAll} />
            <UnauthorizedRoute path={map.SearchPublishBrickPage} component={ViewAll} />
            <UnauthorizedRoute path="/play/dashboard/:categoryId" component={MobileCategory} />
            <UnauthorizedRoute path="/play/brick/:brickId" component={BrickWrapper} innerComponent={PlayBrickRouting} />
            <UnauthorizedRoute path={map.ViewAllPage} component={ViewAll} />

            <StudentRoute path="/my-library/:userId" component={Library} />
            <StudentRoute path="/my-library" component={Library} />
            <StudentRoute path="/post-play/brick/:brickId/:userId/:classId" component={PostPlay} />
            <StudentRoute path="/post-play/brick/:brickId/:userId" component={PostPlay} />

            <StudentRoute path={map.ChoosePlan} component={ChoosePlan} />

            <BuildRoute path={map.ManageClassroomsTab} component={ManageClassrooms} location={location} />
            <BuildRoute path={map.TeachAssignedTab} component={TeachPage} location={location} />
            <BuildRoute path="/classroom-stats/:classroomId" component={ClassStatisticsPage} location={location} />

            <PlayPreviewRoute path="/play-preview/brick/:brickId" component={PlayPreviewRouting} location={location} />
            {/* Creating new bricks */}
            <ProposalBrickRoute path={map.ProposalStart} component={StartBuildingPage} location={location} />
            <ProposalBrickRoute path={map.NewBrick} component={Proposal} location={location} />
            {/* Investigation Build */}
            <BuildBrickRoute
              path={[
                "/build/brick/:brickId/investigation/question-component/:questionId",
                "/build/brick/:brickId/investigation/question/:questionId",
                "/build/brick/:brickId"
              ]}
              component={BuildRouter}
              location={location}
            />
            <BuildRoute path={map.BackToWorkPagePersonal} component={BackToWorkPagePersonal} location={location} />
            <BuildRoute path={map.BackToWorkPagePublished} component={BackToWorkPagePublished} location={location} />
            <BuildRoute path={map.BackToWorkPage} component={BackToWorkPage} location={location} />
            <BuildRoute path={map.AssignmentsClassPage} component={AssignmentsPage} location={location} />
            <BuildRoute path={map.AssignmentsPage} component={AssignmentsPage} location={location} />
            <BuildRoute path="/users" component={UsersListPage} location={location} />
            <BuildRoute path={map.UserProfile + '/:userId'} component={UserProfilePage} location={location} />
            <BuildRoute path="/home" component={MainPage} location={location} />


            <AllUsersRoute path={map.UserProfile} component={UserProfilePage} />

            {/* onboarding pages in order of progression */}
            <Route path={map.TermsSignUp} component={Terms} />
            <AllUsersRoute path={map.ThankYouPage} component={ThankYouPage} isPreferencePage={true} />
            <AllUsersRoute path={map.UserPreferencePage} component={UserPreferencePage} isPreferencePage={true} />
            <AllUsersRoute path={map.SetUsername} component={UsernamePage} isPreferencePage={true} />
            <AllUsersRoute path={map.SelectSubjectPage} component={SelectSubjectPage} />

            <UnauthorizedRoute path={map.LeaderboardPage + '/:competitionId'} component={LeaderboardPage} />

            <AuthRoute path={map.Login + '/email'} component={EmailLoginPage} />
            <AuthRoute path={map.Login} component={LoginPage} />
            <AuthRoute path="/login/:privacy" component={LoginPage} />
            <AuthRoute path={map.ResetPassword} component={ResetPasswordPage} />
            <AuthRoute path={map.ActivateAccount} component={ActivateAccountPage} />
            
            <AdminRoute path={map.AdminBricksPlayed} component={BricksPlayed} />
            <AdminRoute path={map.UsersEvents} component={UsersEvents} />
            <AdminRoute path={map.ClassesEvents} component={ClassesEvents} />
            <AdminRoute path={map.AssignmentEvents} component={AssignmentEvents} />

            <Route path={map.TermsPage} component={PublicTerms} />
            <Route component={AuthRedirectRoute} />
          </Switch>
          <VersionLabel />
          <GlobalFailedRequestDialog />
        </Profiler>
      </ThemeProvider>
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  setLogoutSuccess: () => dispatch(actions.setLogoutSuccess()),
  setReferralId: (referralId: string) => dispatch(actions.setReferralId(referralId)),
});

export default connect(mapState, mapDispatch)(App);
