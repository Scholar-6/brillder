import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";

import "./loginPage.scss";
import actions from "redux/actions/auth";
import PolicyDialog from 'components/baseComponents/policyDialog/PolicyDialog';
import MobileLoginPage from "./phone/MobileLogin";
import map from "components/map";
import LoginDesktopPage from "./desktop/loginDesktopPage/LoginDesktopPage";
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
  );
};

export default connector(LoginPage);
