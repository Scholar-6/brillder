import React from "react";
import { Hidden } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
import { History } from "history";
import TermsLink from "components/baseComponents/TermsLink";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";


interface MobileLoginProps {
  email: string;
  password: string;
  passwordHidden: boolean;
  history: History;
  setEmail(email: string): void;
  setPassword(password: string): void;
  setHidden(hidden: boolean): void;
  register(email: string, password: string): void;
  login(email: string, password: string): void;
  handleLoginSubmit(event: any): void;
  setPolicyDialog(isOpen: boolean): void;
}

class MobileEmailLoginPage extends React.Component<MobileLoginProps> {

  renderSignInPage() {
    return (
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
          <div className="mobile-policy-text">
            <TermsLink history={this.props.history} />
          </div>
        </form>
      </div>
    );
  }

  render() {
    return (
      <Hidden only={["sm", "md", "lg", "xl"]}>
        <div className="first-col">
          {this.renderSignInPage()}
        </div>
      </Hidden>
    );
  }
}

export default MobileEmailLoginPage;
