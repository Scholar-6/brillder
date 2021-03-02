import React, { useState } from "react";
import { Grid, Hidden } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";
import axios from 'axios';

import "./activateAccountPage.scss";
import actions from "redux/actions/auth";
import LoginLogo from 'components/loginPage/components/LoginLogo';
import GoogleButton from "components/loginPage/components/GoogleButton";
import PolicyDialog from 'components/baseComponents/policyDialog/PolicyDialog';
import RegisterButton from "components/loginPage/components/RegisterButton";
import map from "components/map";
import { Redirect, useLocation } from "react-router-dom";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import TermsLink from "components/baseComponents/TermsLink";

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

interface ActivateAccountProps {
  history: History;
  match: any;
}

const ActivateAccountPage: React.FC<ActivateAccountProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
  const [isPolicyOpen, setPolicyDialog] = useState(initPolicyOpen);
  const [loginState, setLoginState] = useState(LoginState.ChooseLoginAnimation);
  const [valid, setValid] = React.useState<boolean>();

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token");

  const verifyToken = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/auth/verifyResetPassword/${token}`);
      setValid(true);
    } catch(e) {
      console.log(e.response.statusCode);
      setValid(false);
    }
  }

  React.useEffect(() => {
    verifyToken();
  }, [token, setValid]);

  const moveToEmailPage = () => {
    props.history.push(map.ActivateAccount + '/email?token=' + token);
  }

  const movingToLogin = () => {
    setLoginState(LoginState.ButtonsAnimation);
    setTimeout(() => {
      moveToEmailPage();
    }, 450);
  }

  if(!valid && valid !== false) {
    return <PageLoader content="Checking token..." />
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
      {valid ? <>
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
        <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
      </>
      : <Redirect to={map.Login} />}
    </Grid>
  );
};

export default connector(ActivateAccountPage);
