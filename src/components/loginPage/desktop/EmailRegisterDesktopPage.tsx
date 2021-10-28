import React, { useState } from "react";
import { Snackbar } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";
import axios from "axios";

import actions from "redux/actions/auth";
import { login } from "services/axios/auth";
import LoginLogo from '../components/LoginLogo';
import WrongLoginDialog from "../components/WrongLoginDialog";
import DesktopLoginForm from "./DesktopLoginForm";
import map from "components/map";

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

interface LoginProps {
  history: History;
  email?: string;
  loginSuccess(): void;
}

const EmailRegisterDesktopPage: React.FC<LoginProps> = (props) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [email, setEmail] = useState(props.email || "");
  const [password, setPassword] = useState("");
  const [isLoginWrong, setLoginWrong] = React.useState(false);

  const validateForm = () => {
    if (email.length > 0 && password.length > 0) {
      return true;
    }
    return "Fill required fields";
  };

  function handleLoginSubmit(event: any) {
    event.preventDefault();

    let res = validateForm();
    if (res !== true) {
      toggleAlertMessage(true);
      setAlertMessage(res);
      return;
    }

    sendLogin(email, password);
  }

  const sendLogin = async (email: string, password: string) => {
    let data = await login(email, password);
    if (!data.isError) {
      if (data === "OK") {
        axios.get(
          `${process.env.REACT_APP_BACKEND_HOST}/user/current`,
          {withCredentials: true}
        ).then(response => {
          const {data} = response;
          if (data.termsAndConditionsAcceptedVersion === null) {
            props.history.push(map.TermsSignUp);
            props.loginSuccess();
          } else {
            props.loginSuccess();
          }
        }).catch(error => {
          // error
          toggleAlertMessage(true);
          setAlertMessage("Server error");
        });
        return;
      }
      let { msg } = data;
      if (!msg) {
        const { errors } = data;
        msg = errors[0].msg;
      }
      toggleAlertMessage(true);
      setAlertMessage(msg);
    } else {
      const { response } = data;
      if (response) {
        if (response.status === 500) {
          toggleAlertMessage(true);
          setAlertMessage("Server error");
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
        toggleAlertMessage(true);
        setAlertMessage(data.errors[0].msg);
        return;
      }

      if (data.msg === "INVALID_EMAIL_OR_PASSWORD") {
        setLoginWrong(true);
      }

      if (data.msg) {
        toggleAlertMessage(true);
        setAlertMessage(data.msg);
      }

      if (data === "OK") {
        sendLogin(email, password);
      }
    }).catch((e) => {
      toggleAlertMessage(true);
      setAlertMessage("Something may be wrong with the connection.");
    });
  };

  return (
    <div className="left-part right">
      <div className="logo">
        <LoginLogo />
      </div>
      <div className="button-box">
        <DesktopLoginForm
          buttonLabel="Sign up"
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          passwordHidden={passwordHidden}
          setHidden={setHidden}
          handleSubmit={handleLoginSubmit}
          register={() => register(email, password)}
        />
      </div>
      <WrongLoginDialog isOpen={isLoginWrong} submit={() => register(email, password)} close={() => setLoginWrong(false)} />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alertShown}
        autoHideDuration={1500}
        onClose={() => toggleAlertMessage(false)}
        message={alertMessage}
        action={<React.Fragment></React.Fragment>}
      />
    </div>
  );
};

export default connector(EmailRegisterDesktopPage);
