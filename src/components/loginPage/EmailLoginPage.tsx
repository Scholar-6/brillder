import React, { useState } from "react";
import { Dialog, Grid, ListItem, ListItemText, Snackbar } from "@material-ui/core";
import { connect } from "react-redux";
import axios from "axios";

import "./loginPage.scss";
import actions from "redux/actions/auth";
import { login } from "services/axios/auth";
import PolicyDialog from 'components/baseComponents/policyDialog/PolicyDialog';
import MobileEmailLogin from './phone/MobileEmailLogin';
import EmailLoginDesktopPage from "./desktop/EmailLoginDesktopPage";
import { trackSignUp } from "services/matomo";
import { isPhone } from "services/phone";
import TextDialog from "components/baseComponents/dialogs/TextDialog";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { getTerms } from "services/axios/terms";
import map from "components/map";
import { useHistory, useRouteMatch } from "react-router";
import { ReduxCombinedState } from "redux/reducers";

const mapState = (state: ReduxCombinedState) => ({
  referralId: state.auth.referralId,
})

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(mapState, mapDispatch);

interface LoginProps {
  referralId?: string;
  loginSuccess(): void;
}

const EmailLoginPage: React.FC<LoginProps> = (props) => {
  const history = useHistory();
  const match = useRouteMatch() as any;
  let initPolicyOpen = false;
  if (match.params.privacy && match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPolicyOpen, setPolicyDialog] = React.useState(initPolicyOpen);
  const [invalidLogin, setInvalidLogin] = React.useState(false);

  const [emptyEmail, setEmptyEmail] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailSended, setEmailSended] = useState(false);
  
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
          { withCredentials: true }
        ).then(response => {
          const { data } = response;
          getTerms().then(r => {
            /*eslint-disable-next-line*/
            if (r && r.lastModifiedDate != data.termsAndConditionsAcceptedVersion) {
              history.push(map.TermsOnlyAccept);
              props.loginSuccess();
            } else {
              props.loginSuccess();
            }
          });
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
        if (response.status === 500 ) {
          toggleAlertMessage(true);
          setAlertMessage("Server error");
        } else if (response.status === 401) {
          const { msg } = response.data;
          if (msg === "INVALID_EMAIL_OR_PASSWORD") {
            setInvalidLogin(true);
          }
        }
      } else {
        toggleAlertMessage(true);
        setAlertMessage("Your email or password may be wrong?");
      }
    }
  };

  const register = (email: string, password: string) => {
    axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/auth/SignUp`,
      { email, password, confirmPassword: password, referralId: props.referralId },
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
      setAlertMessage("Something may be wrong with the connection.");
    });
  };

  if (!isPhone()) {
    return <EmailLoginDesktopPage history={history} match={match} />;
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
        history={history}
        email={email}
        setEmail={setEmail}
        setEmailSended={setEmailSended}
        setEmptyEmail={setEmptyEmail}
        setInvalidEmail={setInvalidEmail}
        password={password}
        setPassword={setPassword}
        passwordHidden={passwordHidden}
        setHidden={setHidden}
        register={register}
        login={login}
        handleLoginSubmit={handleLoginSubmit}
        setPolicyDialog={setPolicyDialog}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alertShown}
        autoHideDuration={1500}
        onClose={() => toggleAlertMessage(false)}
        message={alertMessage}
        action={<React.Fragment></React.Fragment>}
      />
      <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
      <TextDialog
        isOpen={emailSended} close={() => setEmailSended(false)}
        label="."
      />
      <Dialog open={emailSended} onClose={() => setEmailSended(false)} className="dialog-box forgot-password-alert">
        <div className="dialog-header" style={{ marginBottom: 0 }}>
          <div className="flex-center">
            <SpriteIcon name="link" className="active green text-white stroke-2 m-b-02" />
          </div>
          <ListItem>
            <ListItemText
              primary="Now check your email for a password reset link"
              className="bold"
              style={{ minWidth: '30vw' }}
            />
          </ListItem>
          <div></div>
        </div>
      </Dialog>
      <Dialog open={emptyEmail} onClose={() => setEmptyEmail(false)} className="dialog-box forgot-password-alert">
        <div className="dialog-header" style={{ marginBottom: 0 }}>
          <div className="flex-center">
            <SpriteIcon name="alert-triangle" className="active text-white stroke-2 m-b-02" />
          </div>
          <ListItem>
            <ListItemText
              primary="You need to enter an email before clicking this"
              className="bold"
              style={{ minWidth: '30vw' }}
            />
          </ListItem>
        </div>
      </Dialog>
      <Dialog open={invalidEmail} onClose={() => setInvalidEmail(false)} className="dialog-box forgot-password-alert">
        <div className="dialog-header" style={{ marginBottom: 0 }}>
          <div className="flex-center">
            <SpriteIcon name="alert-triangle" className="active text-white stroke-2 m-b-02" />
          </div>
          <ListItem>
            <ListItemText
              primary="This email appears to be invalid"
              className="bold"
              style={{ minWidth: '30vw' }}
            />
          </ListItem>
        </div>
      </Dialog>
      <Dialog open={invalidLogin} onClose={() => setInvalidLogin(false)} className="dialog-box forgot-password-alert">
        <div className="dialog-header" style={{ marginBottom: 0 }}>
          <div className="flex-center">
            <SpriteIcon name="alert-triangle" className="active text-white stroke-2 m-b-02" />
          </div>
          <ListItem>
            <ListItemText
              primary="If you think you have already signed up, but are unable to access your account, please tell us by clicking the help button in the bottom left of this screen"
              className="bold"
              style={{ minWidth: '30vw' }}
            />
          </ListItem>
        </div>
      </Dialog>
    </Grid>
  );
};

export default connector(EmailLoginPage);
