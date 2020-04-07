import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Button from "@material-ui/core/Button";
// @ts-ignore
import { connect } from "react-redux";
import { History } from "history";
import axios from "axios";

import actions from "redux/actions/auth";
import "./loginPage.scss";
import { Redirect } from "react-router-dom";
import { LoginModel, UserLoginType } from "model/auth";

const mapState = (state: any) => {
  return {
    error: state.auth.error,
    isAuthenticated: state.auth.isAuthenticated
  };
};

const mapDispatch = (dispatch: any) => {
  return {
    loginSuccess: (userType: UserLoginType) =>
      dispatch(actions.loginSuccess(userType))
  };
};

const connector = connect(mapState, mapDispatch);

interface LoginProps {
  loginSuccess(userType: UserLoginType): void;
  history: History;
}

const LoginPage: React.FC<LoginProps> = props => {
  const [isNewUser, setNewUser] = useState(false);
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
    return <Redirect to="/choose-user" />;
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
      alert(res);
      return;
    }

    login(email, password);
  }

  const login = (email: string, password: string, isNew: boolean = false) => {
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_HOST}/auth/login/${userType}`,
        { email, password, userType },
        { withCredentials: true }
      )
      .then(response => {
        const { data } = response;
        if (data === "OK") {
          setNewUser(isNew);
          if (!isNew) {
            props.loginSuccess(userType);
          }
          return;
        }
        let { msg } = data;
        if (!msg) {
          const { errors } = data;
          msg = errors[0].msg;
        }
        alert(msg);
      })
      .catch(error => {
        if (
          error.response.status === 500 &&
          userType === UserLoginType.Student
        ) {
          if (!isNewUser) {
            register(email, password);
          }
        }
      });
  };

  const register = (email: string, password: string) => {
    axios
      .post(process.env.REACT_APP_BACKEND_HOST + "/auth/SignUp", {
        email,
        password,
        confirmPassword: password
      })
      .then(resp => {
        const { data } = resp;
        if (data.errors) {
          alert(data.errors[0].msg);
          return;
        }
        if (data.msg) {
          alert(data.msg);
        }
        login(email, password, true);
      })
      .catch(e => {
        alert("Connection problem");
      });
  };

  return (
    <Grid
      className="login-page"
      container
      item
      justify="center"
      alignItems="center"
    >
      <div className="back-col">
        <div className="back-box">
          <ArrowBackIcon
            className="back-button"
            onClick={() =>
              props.history.push(`/choose-login?userType=${userType}`)
            }
          />
        </div>
      </div>
      <div className="first-col">
        <div className="first-item"></div>
        <div className="second-item">
          {isNewUser ? (
            <div></div>
          ) : (
            <div>
              <Grid>
                <img
                  alt="Logo"
                  src="/images/choose-login/logo.png"
                  className="logo-image"
                />
              </Grid>
              <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="login-field"
                  required
                  placeholder="Email"
                />
                <br />
                <div
                  className="password-container"
                  style={{ marginLeft: "10%", width: "80%" }}
                >
                  <input
                    type={passwordHidden ? "password" : "text"}
                    value={password}
                    className="login-field password"
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{
                      fontSize: passwordHidden && password ? "3vw" : "1.5vw"
                    }}
                    placeholder="Password"
                  />
                  <div className="hide-password-icon-container">
                    <Grid
                      container
                      alignContent="center"
                      style={{ height: "100%" }}
                    >
                      <VisibilityIcon
                        className="hide-password-icon"
                        onClick={() => setHidden(!passwordHidden)}
                      />
                    </Grid>
                  </div>
                </div>
                <div
                  style={{
                    width: "80%",
                    marginLeft: "10%",
                    textAlign: "right"
                  }}
                >
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
          )}
        </div>
      </div>
      <div className="second-col">
        <div className="first-item"></div>
        <div className="second-item"></div>
      </div>
      {isNewUser ? (
        <div className="register-success">
          <div className="thanks-info">
            <CheckCircleIcon className="register-success-icon" />
            Thank you for signing up to Brix. <br />
            We’ll get back to you soon with a link <br />
            to activate your account.
          </div>
          <div className="contact-info">
            If you have any further questions, please email theteam@scholar6.org
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </Grid>
  );
};

export default connector(LoginPage);
