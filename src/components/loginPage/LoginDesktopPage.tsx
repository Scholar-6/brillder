import React, { useState } from "react";
import { connect } from "react-redux";
import { History } from "history";

import './LoginDesktopPage.scss';
import actions from "redux/actions/auth";
import LoginLogo from './components/LoginLogo';
import map from "components/map";
import GoogleDesktopButton from "./components/GoogleDesktopButton";
import RegisterDesktopButton from "./components/RegisterDesktopButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TeachIcon from "components/mainPage/components/TeachIcon";

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

const LoginDesktopPage: React.FC<LoginProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
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

  return (
    <div className="login-desktop-page">
      <div className="left-part">
        <div className="logo">
          <LoginLogo />
        </div>
        <div className="button-box">
          <GoogleDesktopButton />
        </div>
        <div className="button-box">
          <RegisterDesktopButton onClick={moveToLogin} />
        </div>
        <div className="button-box">
          <div className="text-box">
            <span>New to Brillder?</span>
            <div className="join-button">
              Join Now
              <SpriteIcon name="arrow-right" />
            </div>
          </div>
        </div>
      </div>
      <div className="right-part">
        <div className="container">
          <img className="phone" alt="" src="/images/login/LoginPhone3_4view.svg" />
        </div>
        <div className="bricks-container">
          <div>
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
          <img alt="" className="glasses" src="/images/login/rotatedGlasses.svg" />
          <TeachIcon />
          <SpriteIcon name="trowel-home" className="trowel-login text-theme-orange" />
        </div>
      </div>
    </div>
  );
};

export default connector(LoginDesktopPage);
