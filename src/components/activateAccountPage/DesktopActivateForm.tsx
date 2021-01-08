import React from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";

import TypingInput from "components/loginPage/components/TypingInput";
import { enterPressed } from "components/services/key";

interface LoginsState {
  handleSubmit(e: any): void;
}

interface ActivateFormProps {
  email: string;
  password: string;
  setPassword(password: string): void;
  passwordHidden: boolean;

  handleSubmit(e: any): void;
  setHidden(passwordHidden: boolean): void;
}

class DesktopActivateForm extends React.Component<ActivateFormProps, LoginsState> {
  constructor(props: ActivateFormProps) {
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
      <div className={className}>
        <div className="input-block">
          <TypingInput
            type="email"
            className="login-field"
            placeholder="Email"
            value={this.props.email}
            disabled={true}
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
            <button onClick={this.props.handleSubmit} className="sign-in-button">Get Started</button>
          </div>
        </div>
      </div>
    );
  }
};

export default DesktopActivateForm;
