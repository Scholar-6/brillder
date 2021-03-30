import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";

import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import actions from "redux/actions/auth";
import PolicyDialog from 'components/baseComponents/policyDialog/PolicyDialog';
import MobileLoginPage from "./MobileLogin";
import map from "components/map";
import LoginDesktopPage from "./desktop/LoginDesktopPage";
import { isPhone } from "services/phone";

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

export enum LoginState {
  ChooseLoginAnimation,
  ChooseLogin,
  ButtonsAnimation,
  Login
}

interface LoginProps {
  loginSuccess(): void;
  history: History;
  match: any;
}

const MobileTheme = React.lazy(() => import('./themes/LoginPageMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/LoginPageTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/LoginPageDesktopTheme'));

const LoginPage: React.FC<LoginProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
  const [isPolicyOpen, setPolicyDialog] = useState(initPolicyOpen);
  const [loginState, setLoginState] = useState(LoginState.ChooseLoginAnimation);

  const moveToLogin = () => {
    props.history.push(map.Login + '/email');
  }

  if (!isPhone()) {
    return <LoginDesktopPage history={props.history} match={props.match} />
  }

  return (
    <React.Suspense fallback={<></>}>
      {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
      <Grid
        className="auth-page login-page"
        container
        item
        justify="center"
        alignItems="center"
      >
        <MobileLoginPage
          loginState={loginState}
          history={props.history}
          match={props.match}
          moveToLogin={moveToLogin}
          setPolicyDialog={setPolicyDialog}
          setLoginState={setLoginState}
        />
        <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
      </Grid>
    </React.Suspense>
  );
};

export default connector(LoginPage);