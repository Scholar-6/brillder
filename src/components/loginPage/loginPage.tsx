import React, { useState } from "react";
import { Grid, Hidden } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";

import "./loginPage.scss";
import actions from "redux/actions/auth";
import LoginLogo from './components/LoginLogo';
import GoogleButton from "./components/GoogleButton";
import PolicyDialog from 'components/baseComponents/policyDialog/PolicyDialog';
import RegisterButton from "./components/RegisterButton";
import MobileLoginPage from "./MobileLogin";
import map from "components/map";
import LoginDesktopPage from "./desktop/LoginDesktopPage";
import TermsLink from "components/baseComponents/TermsLink";
import { isIPad13, isMobile, isTablet } from "react-device-detect";

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

  const movingToLogin = () => {
    setLoginState(LoginState.ButtonsAnimation);
    setTimeout(() => {
      moveToLogin();
    }, 450);
  }

  const renderButtons = () => {
    let className = 'button-box f-column';
    if (loginState === LoginState.ButtonsAnimation) {
      className += ' expanding';
    }
    return (
      <div className={className}>
        <RegisterButton onClick={movingToLogin} />
        <GoogleButton />
      </div>
    );
  }

  if (isIPad13 || isTablet) {
    return <LoginDesktopPage history={props.history} match={props.match} />
  }
  if (!isMobile) {
    return <LoginDesktopPage history={props.history} match={props.match} />
  }

  return (
    <Grid
      className="auth-page login-page"
      container
      item
      justify="center"
      alignItems="center"
    >
      <Hidden only={["xs"]}>
        <div className="choose-login-desktop">
          <Grid container direction="row" className="first-row">
            <div className="first-col"></div>
            <div className="second-col"></div>
            <div className="third-col"></div>
          </Grid>
          <Grid container direction="row" className="second-row">
            <div className="first-col">
              <LoginLogo />
            </div>
            <div className="second-col">
              {renderButtons()}
            </div>
          </Grid>
          <Grid container direction="row" className="third-row">
            <div className="first-col"></div>
            <div className="second-col">
              <TermsLink history={props.history}/>
            </div>
            <div className="third-col"></div>
          </Grid>
        </div>
      </Hidden>
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
  );
};

export default connector(LoginPage);
