import React from "react";
import { History } from "history";

import { LoginState } from "../loginPage";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import GoogleButton from "../components/GoogleButton";
import RegisterButton from "../components/RegisterButton";
import TermsLink from "components/baseComponents/TermsLink";
import { Route, Switch } from "react-router-dom";
import { FirstPage, EmailSignPage, RegisterPage, JoinPage } from "../desktop/routes";
import MobileRegisterPage from './MobileRegister';
import MobileJoinPage from './MobileJoin';

interface MobileLoginState {
  animationFinished: boolean;
}

interface MobileLoginProps {
  loginState: LoginState;
  history: History;
  match: any;
  moveToLogin(): void;
  setPolicyDialog(isOpen: boolean): void;
  setLoginState(loginState: LoginState): void;
}

class MobileLoginPage extends React.Component<MobileLoginProps, MobileLoginState> {
  constructor(props: MobileLoginProps) {
    super(props);

    this.state = {
      animationFinished: false
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.props.setLoginState(LoginState.ChooseLogin)
      setTimeout(() => {
        this.setState({ animationFinished: true });
      }, 2200);
    }, 700);
  }

  renderPrivacyPolicy() {
    return (
      <div className="mobile-policy-text">
        <TermsLink history={this.props.history} />
      </div>
    );
  }

  renderSignInPage() {
    return <div />;
  }

  renderChooseLoginPage(loginState: LoginState) {
    return (
      <div className={`first-col ${!this.state.animationFinished ? 'filled' : ''}`}>
        <div className="second-item">
          <div className={`logo-box ${loginState === LoginState.ChooseLoginAnimation ? "big" : ""}`}>
            <div className="logo-box-inner">
              <div className="logo-image mobile">
                <SpriteIcon name="logo" className="active text-theme-orange" onClick={this.props.moveToLogin} />
              </div>
              <img
                className="logo-text-image"
                alt="text"
                src="/images/choose-user/brillder-white-text.svg"
              />
              <div className="h-arrow-down">
                <SpriteIcon name="arrow-down" />
              </div>
            </div>
          </div>
          <div className="mobile-button-box button-box">
            <div className="button-box">
              <div className="text-box gg-text-box">
                <span>New to Brillder?</span>
                <div className="join-button" onClick={() => this.props.history.push(JoinPage)}>
                  Join Now
                  <SpriteIcon name="arrow-right" />
                </div>
              </div>
            </div>
            <GoogleButton />
            <RegisterButton onClick={this.props.moveToLogin} />
            {this.state.animationFinished && this.renderPrivacyPolicy()}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { loginState } = this.props;
    return (
      <Switch>
        <Route exact path={[FirstPage, EmailSignPage]}>
          {loginState !== LoginState.ChooseLogin &&
            loginState !== LoginState.ChooseLoginAnimation
            ? this.renderSignInPage()
            : this.renderChooseLoginPage(loginState)}
        </Route>
        <Route exact path={JoinPage}>
          <MobileJoinPage history={this.props.history} />
        </Route>
        <Route exact path={RegisterPage}>
          <MobileRegisterPage history={this.props.history} email="" />
        </Route>
      </Switch>
    );
  }
}

export default MobileLoginPage;
