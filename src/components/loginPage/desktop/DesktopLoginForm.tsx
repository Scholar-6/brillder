import React from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";

import TypingInput from "../components/TypingInput";
import { enterPressed } from "components/services/key";

interface LoginsState {
  handleSubmit(e: any): void;
}

interface LoginFormProps {
  buttonLabel?: string;

  email: string;
  setEmail(email: string): void;

  password: string;
  setPassword(password: string): void;
  passwordHidden: boolean;

  handleSubmit(e: any): void;
  register(): void;
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

  render() {
    let className = 'content-box expanded';
    return (
      <form onSubmit={this.props.handleSubmit} className={className}>
        <div className="input-block">
          <TypingInput
            required
            type="email"
            className="login-field"
            placeholder="Email"
            value={this.props.email}
            onChange={this.props.setEmail}
          />
        </div>
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
            <button type="submit" className="btn btn-xl btn-block bg-theme-orange sign-in-button">
              <span>{this.props.buttonLabel ? this.props.buttonLabel : 'Sign in'}</span>
            </button>
          </div>
        </div>
      </form>
    );
  }
};

export default DesktopLoginForm;
