import React, { useState } from "react";
import { Grid, Snackbar, Hidden } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";
import axios from "axios";

import "./activateAccountPage.scss";
import actions from "redux/actions/auth";
import LoginLogo from 'components/loginPage/components/LoginLogo';
import TermsLink from 'components/baseComponents/TermsLink';
import { Redirect, useLocation } from "react-router-dom";
import DesktopActivateForm from "./DesktopActivateForm";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import map from "components/map";
import { UserType } from "model/user";
import { isPhone } from "services/phone";
import EmailLoginDesktopPage from "./EmailLoginDesktopPage";
import MobileEmailLogin from "./MobileEmailLogin";

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
  setDefaultPreference: (defaultPreference?: UserType) => dispatch(actions.setDefaultPreference(defaultPreference)),
});

const connector = connect(null, mapDispatch);

interface EmailActivateAccountProps {
  loginSuccess(): void;
  setDefaultPreference(defaultPreference?: UserType): void;
  history: History;
  match: any;
}

const EmailActivateAccountPage: React.FC<EmailActivateAccountProps> = (props) => {
  const [alertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token");

  const [email, setEmail] = useState("");
  const [defaultPreference, setDefaultPreference] = useState<UserType | undefined>();
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState<boolean>();

  const verifyToken = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/auth/verifyResetPassword/${token}`);
      setValid(true);
      setEmail(response.data.email);
      setDefaultPreference(response.data.defaultPreference);
    } catch (e) {
      console.log(e.response.statusCode);
      setValid(false);
    }
  }

  React.useEffect(() => {
    verifyToken();
  }, [token, setValid]);

  const resetPassword = React.useCallback(async (e: any, password: string) => {
    e.preventDefault();
    console.log(password)
    try {
      if (password.length > 0) {
        await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/auth/changePassword/${token}`, { password: password }, { withCredentials: true });
        props.loginSuccess();
        props.setDefaultPreference(defaultPreference);
      }
    } catch (e) {
      console.log(e);
    }
  }, [token, password])

  if (!valid && valid !== false) {
    return <PageLoader content="Checking token..." />
  }

  if (!valid) {
    return <Redirect to={map.Login} />;
  }

  if (!email) {
    return <PageLoader content="Checking token..." />
  }

  if (!isPhone()) {
    return <EmailLoginDesktopPage history={props.history} email={email} match={props.match} handleSubmit={resetPassword} />
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
        register={() => {}}
        login={() => {}}
        handleLoginSubmit={() => {}}
        setPolicyDialog={() => {}}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alertShown}
        autoHideDuration={1500}
        onClose={() => toggleAlertMessage(false)}
        message={alertMessage}
        action={<React.Fragment></React.Fragment>}
      />
    </Grid>
  );
};

export default connector(EmailActivateAccountPage);
