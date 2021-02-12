import React, { useState } from "react";
import { Grid, Hidden } from "@material-ui/core";
import { History } from "history";

import "./loginPage.scss";
import LoginLogo from './components/LoginLogo';
import GoogleButton from "./components/GoogleButton";
import PolicyDialog from 'components/baseComponents/policyDialog/PolicyDialog';
import RegisterButton from "./components/RegisterButton";
import MobileLoginPage from "./MobileLogin";
import map from "components/map";

export enum LoginState {
  ChooseLoginAnimation,
  ChooseLogin,
  ButtonsAnimation,
  Login
}

interface LoginProps {
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
              <span className="policy-text" onClick={() => setPolicyDialog(true)}>Privacy Policy</span>
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

export default LoginPage;
