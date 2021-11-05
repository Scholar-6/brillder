import React from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
import { History } from "history";
import axios from "axios";
//@ts-ignore
import isEmail from 'validator/lib/isEmail';

import TermsLink from "components/baseComponents/TermsLink";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import { hideZendesk, showZendesk } from "services/zendesk";
import { isPhone } from "services/phone";
import { JoinPage } from "../desktop/routes";

interface MobileLoginProps {
  email: string;
  password: string;
  passwordHidden: boolean;
  history: History;
  setEmailSended(v: boolean): void;
  setEmptyEmail(v: boolean): void;
  setInvalidEmail(v: boolean): void;
  setEmail(email: string): void;
  setPassword(password: string): void;
  setHidden(hidden: boolean): void;
  register(email: string, password: string): void;
  login(email: string, password: string): void;
  handleLoginSubmit(event: any): void;
  setPolicyDialog(isOpen: boolean): void;
}

interface State {
  originalHeight: number;
  keyboardShown: boolean;
  resizeHandler(): void;
}
class MobileEmailLoginPage extends React.Component<MobileLoginProps, State> {
  constructor(props: MobileLoginProps) {
    super(props);

    this.state = {
      originalHeight: window.innerHeight,
      keyboardShown: false,
      resizeHandler: this.resizeHandler.bind(this)
    }
  }

  resizeHandler() {
    if (this.state.originalHeight > window.innerHeight + 60) {
      hideZendesk();
      this.setState({ keyboardShown: true })
    } else {
      this.setState({ keyboardShown: false })
      showZendesk();
    }
  }

  componentDidMount() {
    if (isPhone()) {
      window.addEventListener("resize", this.state.resizeHandler);
    }
  }

  componentWillUnmount() {
    if (isPhone()) {
      window.removeEventListener("resize", this.state.resizeHandler);
    }
  }

  render() {
    return (
      <div className="first-col">
        <div className="second-item">
          <div className="logo-box">
            <div className="logo-box-inner">
              <div className="logo-image mobile">
                <SpriteIcon name="logo" className="active text-theme-orange" onClick={() => this.props.history.push(map.Login)} />
              </div>
            </div>
            <div className="h-arrow-down">
              <SpriteIcon name="arrow-down" />
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
            {!this.state.keyboardShown &&
            <div className="phone-reset-link-container">
              <div className="reset-password-link" onClick={async () => {
                try {
                  if (this.props.email) {
                    if (isEmail(this.props.email)) {
                      try {
                        await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/auth/resetPassword/${this.props.email}`, {}, { withCredentials: true });
                      } catch { }
                      this.props.setEmailSended(true);
                    } else {
                      this.props.setInvalidEmail(true);
                    }
                  } else {
                    this.props.setEmptyEmail(true);
                  }
                } catch {
                  // failed
                }
              }}>Forgot password?</div>
            </div>}
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
                className="sign-in-button orange-button bold"
                type="submit"
              >
                Sign in
              </Button>
            </div>
            <div className="button-box" style={{marginTop: '3.4vh'}}>
              <div className="text-box gg-text-box">
                <span>New to Brillder?</span>
                <div className="join-button" onClick={() => this.props.history.push(JoinPage)}>
                  Join Now
                  <SpriteIcon name="arrow-right" />
                </div>
              </div>
            </div>
            {!this.state.keyboardShown &&
            <div className="mobile-policy-text">
              <TermsLink history={this.props.history} />
            </div>}
          </form>
        </div>
      </div>
    );
  }
}

export default MobileEmailLoginPage;
