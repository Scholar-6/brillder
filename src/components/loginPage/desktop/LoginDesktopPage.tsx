import React, { useState } from "react";
import { connect } from "react-redux";
import { History } from "history";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

import './LoginDesktopPage.scss';
import actions from "redux/actions/auth";
import LoginLogo from '../components/LoginLogo';
import map from "components/map";
import GoogleDesktopButton from "./GoogleDesktopButton";
import RegisterDesktopButton from "./RegisterDesktopButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TermsLink from "components/baseComponents/TermsLink"
import TeachIcon from "components/mainPage/components/TeachIcon";
import PhoneIcon from "./PhoneIcon";
import TypingLabel from "components/baseComponents/TypingLabel";
import { EmailSignPage, JoinPage, RegisterPage } from "./routes";
import EmailRegisterDesktopPage from "./EmailRegisterDesktopPage";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog"; // TODO: Reuse this for the cookie Popup

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

export enum LoginPage {
  Default,
  Join,
  Register
}

interface LoginProps {
  loginSuccess(): void;
  history: History;
  match: any;
}

const LoginDesktopPage: React.FC<LoginProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
  const [isPolicyOpen, setPolicyDialog] = useState(initPolicyOpen);
  const { history } = props;
  let page = LoginPage.Default;
  const { pathname } = history.location;
  if (pathname === JoinPage) {
    page = LoginPage.Join;
  } else if (pathname === RegisterPage) {
    page = LoginPage.Register;
  }

  const moveToLogin = () => history.push(EmailSignPage);
  const moveToJoin = () => history.push(JoinPage);
  const moveToRegister = () => history.push(RegisterPage);

  return (
    <div className="login-desktop-page">
      {(page === LoginPage.Join || page === LoginPage.Register) &&
        <div className="left-part-join">
          <h1>
            <TypingLabel className="" onEnd={() => { }} label="Join the revolution" />
          </h1>
          <div className="image-container spinning">
            <img alt="" src="/images/login/PhoneWheellogin.svg" />
          </div>
        </div>}
      <Switch>
        <Route exact path={RegisterPage}>
          <EmailRegisterDesktopPage history={history} />
        </Route>
        <Route exact path={JoinPage}>
          <div className="left-part right">
            <div className="logo">
              <LoginLogo />
            </div>
            <div className="button-box">
              <GoogleDesktopButton label="Register with Google" />
            </div>
            <div className="button-box">
              <RegisterDesktopButton label="Register with email" onClick={moveToRegister} />
            </div>
          </div>
        </Route>
        <Route exact path={map.Login}>
          <div className="left-part">
            <div className="logo">
              <LoginLogo />
            </div>
            <div className="button-box">
              <GoogleDesktopButton label="Sign in with Google" />
            </div>
            <div className="button-box">
              <RegisterDesktopButton label="Sign in with email" onClick={moveToLogin} />
            </div>
            <div className="button-box">
              <div className="text-box">
                <span>New to Brillder?</span>
                <div className="join-button" onClick={moveToJoin}>
                  Join Now
                  <SpriteIcon name="arrow-right" />
                </div>
              </div>
            </div>
          </div>
        </Route>
      </Switch>
      <div className="right-part">
        <div className="container">
          <PhoneIcon />
        </div>
        <div className="bricks-container">
          <div className="inner">
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
            </div>
          </div>
        </div>
        <div className="icons-container">
          <img alt="" className="glasses floating1" src="/images/login/rotatedGlasses.svg" />
          <TeachIcon className="floating3" />
          <SpriteIcon name="trowel-home" className="trowel-login text-theme-orange floating2" />
        </div>
      </div>
      <TermsLink history={props.history}/>
      <div className="policy-text">
        <span onClick={() => setPolicyDialog(true)}>
        </span>
      </div>
      <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
    </div>
  );
};

export default connector(LoginDesktopPage);
