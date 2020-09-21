import React from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { LoginState } from "../loginPage";
import TypingInput from "./TypingInput";
import { enterPressed } from "components/services/key";

interface LoginFormProps {
  email: string;
  setEmail(email: string): void;

  password: string;
  setPassword(password: string): void;

  loginState: LoginState;
  passwordHidden: boolean;

  handleSubmit(e: any): void;
  register(): void;
  setHidden(passwordHidden: boolean): void;
}

class DesktopLoginForm extends React.Component<LoginFormProps> {
  constructor(props: LoginFormProps) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyPressed.bind(this), false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPressed.bind(this), false);
  }
  
  onKeyPressed(e: any) {
    if (enterPressed(e)) {
      this.props.handleSubmit(e);
    }
  }

  render() {
    let className = 'content-box';
    if (this.props.loginState !== LoginState.ButtonsAnimation) {
      className += ' expanded';
    }
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
            <button type="button" className="sign-up-button" onClick={this.props.register}>Sign up</button>
            <button type="submit" className="sign-in-button">Sign in</button>
          </div>
        </div>
      </form>
    );
  }
};

export default DesktopLoginForm;
