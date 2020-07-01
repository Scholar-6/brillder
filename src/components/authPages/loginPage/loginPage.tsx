import React, { useState } from "react";
import { Grid, Snackbar } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
// @ts-ignore
import { connect } from "react-redux";
import { History } from "history";
import axios from "axios";

import actions from "redux/actions/auth";
import "./loginPage.scss";
import { Redirect } from "react-router-dom";
import { UserLoginType } from "model/auth";
import { ReduxCombinedState } from "redux/reducers";

import sprite from "../../../assets/img/icons-sprite.svg";

const mapState = (state: ReduxCombinedState) => ({
  error: state.auth.error,
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatch = (dispatch: any) => ({
  loginSuccess: (userType: UserLoginType) => dispatch(actions.loginSuccess(userType))
});

const connector = connect(mapState, mapDispatch);

interface LoginProps {
  loginSuccess(userType: UserLoginType): void;
  history: History;
}

const LoginPage: React.FC<LoginProps> = props => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function getQueryParam(param: string) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    return url.searchParams.get(param);
  }

  const type = getQueryParam("userType");
  if (!type) {
    return <Redirect to="/choose-login" />;
  }
  const userType = parseInt(type) as UserLoginType;

  const validateForm = () => {
    if (email.length > 0 && password.length > 0) {
      return true;
    }
    return "Fill required fields";
  };

  function handleSubmit(event: any) {
    event.preventDefault();

    let res = validateForm();
    if (res !== true) {
      toggleAlertMessage(true);
      setAlertMessage(res);
      return;
    }

    login(email, password);
  }

  const login = (email: string, password: string) => {
    axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/auth/login/${userType}`,
      { email, password, userType },
      { withCredentials: true }
    ).then(response => {
      const { data } = response;
      if (data === "OK") {
        props.loginSuccess(userType);
        return;
      }
      let { msg } = data;
      if (!msg) {
        const { errors } = data;
        msg = errors[0].msg;
      }
      toggleAlertMessage(true);
      setAlertMessage(msg);
    }).catch(error => {
      const { response } = error;
      if (response) {
        if (
          response.status === 500 &&
          userType === UserLoginType.Student
        ) {
          toggleAlertMessage(true);
          setAlertMessage("Server error");
        } else if (response.status === 401) {
          const { msg } = response.data;
          if (msg === 'USER_IS_NOT_ACTIVE') {
            props.history.push('/sign-up-success');
          } else if (msg === 'INVALID_EMAIL_OR_PASSWORD') {
            toggleAlertMessage(true);
            setAlertMessage("Password is not correct");
          }
        }
      } else {
        toggleAlertMessage(true);
        setAlertMessage("Connection problem");
      }
    });
  };

  const register = (email: string, password: string) => {
    axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/auth/SignUp/${userType}`,
      { email, password, confirmPassword: password },
      { withCredentials: true }
    ).then(resp => {
      const { data } = resp;

      if (data.errors) {
        toggleAlertMessage(true);
        setAlertMessage(data.errors[0].msg);
        return;
      }

      if (data.msg) {
        toggleAlertMessage(true);
        setAlertMessage(data.msg);
      }

      if (data === "OK") {
        if (userType !== UserLoginType.Student) {
          props.history.push('/sign-up-success');
        } else {
          login(email, password);
        }
      }
    }).catch(e => {
      toggleAlertMessage(true);
      setAlertMessage("Connection problem");
    });
  };

  return (
    <Grid
      className="auth-page login-page"
      container
      item
      justify="center"
      alignItems="center">
      <div className="back-col">
        <div className="back-box">
          <svg className="svg active back-button" onClick={() => props.history.push(`/choose-login?userType=${userType}`)}>
            <use href={sprite + "#arrow-down"} className="theme-orange" />
          </svg>
        </div>
      </div>
      <div className="first-col">
        <div className="first-item"></div>
        <div className="second-item">
          <div>
            <Grid>
              <div className="logo-box">
                <svg className="svg active logo-image mobile" onClick={() => props.history.push(`/choose-login?userType=${userType}`)}>
                  <use href={sprite + "#login"} />
                </svg>
                <img alt="Logo" src="/images/choose-login/logo.png" className="logo-image website" />
              </div>
            </Grid>
            <form onSubmit={handleSubmit} className="content-box">
              <div className="input-block">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="login-field"
                  required
                  placeholder="Email"
                />
              </div>
              <div className="input-block">
                <input
                  type={passwordHidden ? "password" : "text"}
                  value={password}
                  className="login-field password"
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
                <div className="hide-password-icon-container">
                  <VisibilityIcon
                    className="hide-password-icon"
                    onClick={() => setHidden(!passwordHidden)}
                  />
                </div>
              </div>
              <div className="input-block button-box">
                <Button
                  variant="contained"
                  color="primary"
                  className="sign-up-button"
                  type="button"
                  onClick={() => register(email, password)}
                >
                  Sign up
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
            </form>
          </div>
        </div>
      </div>
      <div className="second-col">
        <div className="first-item"></div>
        <div className="second-item"></div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={alertShown}
        autoHideDuration={1500}
        onClose={() => toggleAlertMessage(false)}
        message={alertMessage}
        action={<React.Fragment></React.Fragment>}
      />
    </Grid>
  );
};

export default connector(LoginPage);
