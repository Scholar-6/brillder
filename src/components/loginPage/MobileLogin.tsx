import React from "react";
import { Hidden } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
import { History } from "history";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";

import GoogleButton from "./components/GoogleButton";
import RegisterButton from "./components/RegisterButton";
import { LoginState } from "./loginPage";

interface MobileLoginState {
  animationFinished: boolean;
}

interface MobileLoginProps {
  email: string;
  password: string;
  passwordHidden: boolean;
  loginState: LoginState;
  history: History;
  match: any;
  moveToLogin(): void;
  loginSuccess(): void;
  setEmail(email: string): void;
  setPassword(password: string): void;
  setHidden(hidden: boolean): void;
  register(email: string, password: string): void;
  login(email: string, password: string): void;
  handleLoginSubmit(event: any): void;
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
        <span onClick={() => this.props.setPolicyDialog(true)}>
          Privacy Policy
        </span>
      </div>
    );
  }

  renderSignInPage() {
    return (
      <div className="first-col">
        <div className="second-item">
          <div className="logo-box">
            <div className="logo-box-inner">
              <div className="logo-image mobile">
                <SpriteIcon name="login" className="active text-theme-orange" onClick={() => this.props.history.push(map.Login)} />
              </div>
            </div>
          </div>
          <form
            onSubmit={this.props.handleLoginSubmit}
            className="mobile-button-box content-box"
          >
            <div className="input-block">
              <input
                type="email"
                value={this.props.email}
                onChange={(e) => this.props.setEmail(e.target.value)}
                className="login-field"
                required
                placeholder="Email"
              />
            </div>
            <div className="input-block">
              <input
                type={this.props.passwordHidden ? "password" : "text"}
                value={this.props.password}
                className="login-field password"
                onChange={(e) => this.props.setPassword(e.target.value)}
                required
                placeholder="Password"
              />
              <div className="hide-password-icon-container">
                <VisibilityIcon
                  className="hide-password-icon"
                  onClick={() =>
                    this.props.setHidden(!this.props.passwordHidden)
                  }
                />
              </div>
            </div>
            <div className="input-block button-box">
              <Button
                variant="contained"
                color="primary"
                className="sign-up-button"
                type="button"
                onClick={() =>
                  this.props.register(this.props.email, this.props.password)
                }
              >
                Register
              </Button>
              <Button
                variant="contained"
                color="primary"
                className="sign-in-button"
                type="submit"
              >
                Sign in
              </Button>
            </div>
            {this.renderPrivacyPolicy()}
          </form>
        </div>
      </div>
    );
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
            </div>
          </div>
          <div className="mobile-button-box button-box">
            <RegisterButton onClick={this.props.moveToLogin} />
            <GoogleButton />
            {this.state.animationFinished && this.renderPrivacyPolicy()}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { loginState } = this.props;
    return (
      <Hidden only={["sm", "md", "lg", "xl"]}>
        {loginState !== LoginState.ChooseLogin &&
          loginState !== LoginState.ChooseLoginAnimation
          ? this.renderSignInPage()
          : this.renderChooseLoginPage(loginState)}
      </Hidden>
    );
  }
}

export default MobileLoginPage;
