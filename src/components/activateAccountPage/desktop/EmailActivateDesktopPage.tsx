import React, { useState } from "react";
import { Snackbar } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";
import axios from "axios";

import actions from "redux/actions/auth";
import { setUserPreference } from "services/axios/user";
import { UserPreferenceType } from "model/user";

import LoginLogo from 'components/loginPage/components/LoginLogo';
import WrongLoginDialog from "components/loginPage/components/WrongLoginDialog";
import DesktopActivateForm from "./DesktopActivateForm";
import map from "components/map";

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

interface LoginProps {
  history: History;
  token: string;
  email: string;
  loginSuccess(): void;
}

const EmailActivateDesktopPage: React.FC<LoginProps> = (props) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoginWrong, setLoginWrong] = React.useState(false);
  const [isSubmiting, setSubmiting] = React.useState(false);

  const {email} = props;

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

    resetPassword(password);
  }

  const resetPassword = async (password: string) => {
    if (isSubmiting) { return; }
    setSubmiting(true);
    try {
      if (password.length > 0) {
        await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/auth/changePassword/${props.token}`, { password: password }, { withCredentials: true });
        await setUserPreference(UserPreferenceType.Student);
        props.history.push(map.TermsSignUp);
        props.loginSuccess();
      }
    } catch (e) {
      console.log(e);
    }
    setSubmiting(false);
  }

  return (
    <div className="left-part right">
      <div className="logo">
        <LoginLogo />
      </div>
      <div className="button-box">
        <DesktopActivateForm
          email={email}
          password={password}
          setPassword={setPassword}
          passwordHidden={passwordHidden}
          setHidden={setHidden}
          handleSubmit={handleLoginSubmit}
        />
      </div>
      <WrongLoginDialog isOpen={isLoginWrong} submit={() => {}} close={() => setLoginWrong(false)} />
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

export default connector(EmailActivateDesktopPage);
