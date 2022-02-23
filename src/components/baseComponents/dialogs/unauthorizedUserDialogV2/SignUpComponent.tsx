import React from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Snackbar } from "@material-ui/core";

import { enterPressed } from "components/services/key";
import TypingInput from "components/loginPage/components/TypingInput";
import axios from "axios";
import { login } from "services/axios/auth";


interface LoginsState {
  email: string;
  password: string;
  passwordHidden: boolean;
  alertShown: boolean;
  alertMessage: string;
  isLoginWrong: boolean;
  handleSubmit(e: any): void;
}

interface LoginFormProps {
  success(): void;
}

class SignUpComponent extends React.Component<LoginFormProps, LoginsState> {
  constructor(props: LoginFormProps) {
    super(props);

    this.state = {
      email: '',
      password: '',
      passwordHidden: true,
      alertShown: false,
      isLoginWrong: false,
      alertMessage: '',
      handleSubmit: this.onKeyPressed.bind(this)
    }
  }

  handleSubmit(event: any) {
    event.preventDefault();

    const { email, password } = this.state;

    const validateForm = () => {
      if (email.length > 0 && password.length > 0) {
        return true;
      }
      return "Fill required fields";
    };

    let res = validateForm();
    if (res !== true) {
      this.setState({ alertShown: true, alertMessage: res });
      return;
    }

    const sendLogin = async (email: string, password: string) => {
      let data = await login(email, password);
      if (!data.isError) {
        if (data === "OK") {
          axios.get(
            `${process.env.REACT_APP_BACKEND_HOST}/user/current`,
            { withCredentials: true }
          ).then(response => {
            this.props.success();
          }).catch(error => {
            // error
            this.setState({ alertShown: true, alertMessage: "Server error" });
          });
          return;
        }
        let { msg } = data;
        if (!msg) {
          const { errors } = data;
          msg = errors[0].msg;
        }
        this.setState({ alertShown: true, alertMessage: msg });
      } else {
        const { response } = data;
        if (response) {
          if (response.status === 500) {
            this.setState({ alertShown: true, alertMessage: "Server error" });
          } else if (response.status === 401) {
            const { msg } = response.data;
            if (msg === "INVALID_EMAIL_OR_PASSWORD") {
              register(email, password);
            }
          }
        } else {
          register(email, password);
        }
      }
    };

    const register = (email: string, password: string) => {
      axios.post(
        `${process.env.REACT_APP_BACKEND_HOST}/auth/SignUp/3`,
        { email, password, confirmPassword: password },
        { withCredentials: true }
      ).then((resp) => {
        const { data } = resp;

        if (data.errors) {
          this.setState({ alertShown: true, alertMessage: data.errors[0].msg });
          return;
        }

        if (data.msg === "INVALID_EMAIL_OR_PASSWORD") {
          this.setState({ isLoginWrong: true });
        }

        if (data.msg) {
          this.setState({ alertShown: true, alertMessage: data.msg });
        }

        if (data === "OK") {
          sendLogin(email, password);
        }
      }).catch((e) => {
        this.setState({ alertShown: true, alertMessage: "Something may be wrong with the connection." });
      });
    };

    sendLogin(email, password);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleSubmit, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleSubmit, false);
  }

  onKeyPressed(e: any) {
    if (enterPressed(e)) {
      this.handleSubmit(e);
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} className="content-box expanded sign-up-form">
        <div className="logo">
          <img alt="Logo" src="/images/choose-login/logo.png" className="logo-image" />
          <div className="MuiGrid-root MuiGrid-container MuiGrid-justify-xs-center">
            <img alt="Logo" src="/images/choose-user/brillder-white-text.svg" className="logo-text-image" />
          </div>
        </div>
        <div className="input-block">
          <TypingInput
            required
            type="email" name="email"
            className="login-field"
            placeholder="Email"
            value={this.state.email}
            onChange={email => this.setState({ email })}
          />
        </div>
        <div className="input-block">
          <TypingInput
            required
            type={this.state.passwordHidden ? "password" : "text"}
            className="login-field password"
            value={this.state.password}
            placeholder="Password"
            onChange={password => this.setState({ password })}
          />
          <div className="hide-password-icon-container">
            <VisibilityIcon
              className="hide-password-icon"
              onClick={() => this.setState({ passwordHidden: !this.state.passwordHidden })}
            />
          </div>
        </div>
        <div className="input-block">
          <div className="button-box">
            <button type="submit" className="sign-in-button">Sign up</button>
          </div>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={this.state.alertShown}
          autoHideDuration={1500}
          onClose={() => this.setState({ alertShown: false })}
          message={this.state.alertMessage}
          action={<React.Fragment></React.Fragment>}
        />
      </form>
    );
  }
};

export default SignUpComponent;
