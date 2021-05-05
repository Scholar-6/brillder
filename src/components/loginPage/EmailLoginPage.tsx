import React, { useState } from "react";
import { Grid, Snackbar, Hidden } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";
import axios from "axios";

import "./loginPage.scss";
import actions from "redux/actions/auth";
import { login } from "services/axios/auth";
import LoginLogo from './components/LoginLogo';
import PolicyDialog from 'components/baseComponents/policyDialog/PolicyDialog';
import WrongLoginDialog from "./components/WrongLoginDialog";
import DesktopLoginForm from "./desktop/DesktopLoginForm";
import MobileEmailLogin from './MobileEmailLogin';
import TermsLink from "components/baseComponents/TermsLink";
import EmailLoginDesktopPage from "./desktop/EmailLoginDesktopPage";
import { trackSignUp } from "services/matomo";
import { isPhone } from "services/phone";
import map from "components/map";

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

interface LoginProps {
  loginSuccess(): void;
  history: History;
  match: any;
}

const EmailLoginPage: React.FC<LoginProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPolicyOpen, setPolicyDialog] = React.useState(initPolicyOpen);
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
        props.loginSuccess();
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
        if (response.status === 500 ) {
          toggleAlertMessage(true);
          setAlertMessage("Server error");
        } else if (response.status === 401) {
          const { msg } = response.data;
          if (msg === "INVALID_EMAIL_OR_PASSWORD") {
            setLoginWrong(true);
          }
        }
      } else {
        toggleAlertMessage(true);
        setAlertMessage("Connection problem");
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

      if (data.msg) {
        toggleAlertMessage(true);
        setAlertMessage(data.msg);
      }

      if (data === "OK") {
        trackSignUp();
        sendLogin(email, password);
      }
    }).catch((e) => {
      toggleAlertMessage(true);
      setAlertMessage("Connection problem");
    });
  };

  if (!isPhone()) {
    return <EmailLoginDesktopPage history={props.history} match={props.match} />
  }

  return (
    <Grid
      className="auth-page login-page"
      container
      item
      justify="center"
      alignItems="center"
    >
      <MobileEmailLogin
        history={props.history}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        passwordHidden={passwordHidden}
        setHidden={setHidden}
        register={register}
        login={login}
        handleLoginSubmit={handleLoginSubmit}
        setPolicyDialog={setPolicyDialog}
      />
      <WrongLoginDialog isOpen={isLoginWrong} submit={() => register(email, password)} close={() => setLoginWrong(false)} />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alertShown}
        autoHideDuration={1500}
        onClose={() => toggleAlertMessage(false)}
        message={alertMessage}
        action={<React.Fragment></React.Fragment>}
      />
      <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
    </Grid>
  );
};

export default connector(EmailLoginPage);
