import React, { useState } from "react";
import { Grid, Snackbar, Hidden } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";
import axios from "axios";

import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import actions from "redux/actions/auth";
import LoginLogo from 'components/loginPage/components/LoginLogo';
import TermsLink from 'components/baseComponents/TermsLink';
import { Redirect, useLocation } from "react-router-dom";
import DesktopActivateForm from "./DesktopActivateForm";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import map from "components/map";
import { UserType } from "model/user";

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

const MobileTheme = React.lazy(() => import('../loginPage/themes/LoginPageMobileTheme'));
const TabletTheme = React.lazy(() => import('../loginPage/themes/LoginPageTabletTheme'));
const DesktopTheme = React.lazy(() => import('../loginPage/themes/LoginPageDesktopTheme'));

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

  const validateForm = () => {
    if (password.length > 0) {
      return true;
    }
    return "Fill required fields";
  };

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

  const resetPassword = React.useCallback(async () => {
    try {
      if (validateForm() === true) {
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


  return (
    <React.Suspense fallback={<></>}>
      {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
      <Grid
        className="auth-page login-page"
        container
        item
        justify="center"
        alignItems="center"
      >
        {valid ?
          <>
            <Hidden only={["xs"]}>
              <div className="choose-login-desktop">
                <Grid container direction="row" className="first-row">
                  <div className="first-col"></div>
                  <div className="second-col"></div>
                  <div className="third-col"></div>
                </Grid>
                <Grid container direction="row" className="second-row">
                  <div className="first-col">
                    <LoginLogo />
                  </div>
                  <div className="second-col">
                    <DesktopActivateForm
                      email={email}
                      password={password}
                      setPassword={setPassword}
                      passwordHidden={passwordHidden}
                      setHidden={setHidden}
                      handleSubmit={resetPassword}
                    />
                  </div>
                </Grid>
                <Grid container direction="row" className="third-row">
                  <div className="first-col"></div>
                  <div className="second-col">
                    <TermsLink history={props.history} />
                  </div>
                  <div className="third-col"></div>
                </Grid>
              </div>
            </Hidden>
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              open={alertShown}
              autoHideDuration={1500}
              onClose={() => toggleAlertMessage(false)}
              message={alertMessage}
              action={<React.Fragment></React.Fragment>}
            />
          </>
          : <Redirect to={map.Login} />}
      </Grid>
    </React.Suspense>
  );
};

export default connector(EmailActivateAccountPage);
