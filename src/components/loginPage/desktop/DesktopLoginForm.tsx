import React from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";

import TypingInput from "../components/TypingInput";
import { enterPressed } from "components/services/key";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { JoinPage } from "./routes";

interface LoginsState {
  handleSubmit(e: any): void;
}

interface LoginFormProps {
  buttonLabel?: string;

  isLogin?: boolean;
  history?: any;

  email: string;
  setEmail(email: string): void;

  password: string;
  setPassword(password: string): void;
  passwordHidden: boolean;

  resetPassword?(): void;
  handleSubmit(e: any): void;
  setHidden(passwordHidden: boolean): void;
}

class DesktopLoginForm extends React.Component<LoginFormProps, LoginsState> {
  constructor(props: LoginFormProps) {
    super(props);

    this.state = {
      handleSubmit: this.onKeyPressed.bind(this)
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleSubmit, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleSubmit, false);
  }

  onKeyPressed(e: any) {
    if (enterPressed(e)) {
      this.props.handleSubmit(e);
    }
  }

  moveToJoin() {
    if (this.props.history) {
      this.props.history.push(JoinPage);
    }
  }

  render() {
    const { resetPassword } = this.props;


    return (
      <form onSubmit={this.props.handleSubmit} className="content-box expanded">
        <div className="input-block">
          <TypingInput
            required
            type="email" name="email"
            className="login-field"
            placeholder="Email"
            value={this.props.email}
            onChange={this.props.setEmail}
          />
        </div>
        {resetPassword &&
          <div className="reset-link-container">
            <div className="reset-password-link" onClick={() => resetPassword()}>Forgot password?</div>
          </div>}
        <div className="input-block">
          <TypingInput
            required
            type={this.props.passwordHidden ? "password" : "text"}
            className="login-field password"
            value={this.props.password}
            placeholder="Password"
            onChange={this.props.setPassword}
          />
          <div className="hide-password-icon-container">
            <VisibilityIcon
              className="hide-password-icon"
              onClick={() => this.props.setHidden(!this.props.passwordHidden)}
            />
          </div>
        </div>
        <div className="input-block">
          <div className="button-box">
            <button type="submit" className="sign-in-button">{this.props.buttonLabel ? this.props.buttonLabel : 'Sign in'}</button>
          </div>
        </div>
        {this.props.isLogin && <div className="button-box">
          <div className="text-box">
            <span>New to Brillder?</span>
            <div className="join-button" onClick={() => this.moveToJoin()}>
              Join Now
              <SpriteIcon name="arrow-right" />
            </div>
          </div>
        </div>}
      </form>
    );
  }
};

export default DesktopLoginForm;
