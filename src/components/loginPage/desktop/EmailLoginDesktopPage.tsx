import React, { useState } from "react";
import { Avatar, Dialog, ListItem, ListItemAvatar, ListItemText, Snackbar } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";
import axios from "axios";
//@ts-ignore
import isEmail from 'validator/lib/isEmail';

import actions from "redux/actions/auth";
import { login } from "services/axios/auth";
import LoginLogo from '../components/LoginLogo';
import WrongLoginDialog from "../components/WrongLoginDialog";
import DesktopLoginForm from "./DesktopLoginForm";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TeachIcon from "components/mainPage/components/TeachIcon";
import PhoneIcon from "./PhoneIcon";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog";
import TermsLink from "components/baseComponents/TermsLink";
import { trackSignUp } from "services/matomo";
import map from "components/map";
import { getTerms } from "services/axios/terms";
import LoginBricks from "../components/LoginBricks";
import { ReduxCombinedState } from "redux/reducers";

const mapState = (state: ReduxCombinedState) => ({
  referralId: state.auth.referralId,
})

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(mapState, mapDispatch);

interface LoginProps {
  history: History;
  match: any;
  referralId?: string;
  loginSuccess(): void;
}

const EmailLoginDesktopPage: React.FC<LoginProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
  const [isPolicyOpen, setPolicyDialog] = useState(initPolicyOpen);

  const [emptyEmail, setEmptyEmail] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailSended, setEmailSended] = useState(false);
  const [invalidLogin, setInvalidLogin] = React.useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [email, setEmail] = useState("");
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
    const data = await login(email, password);
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
              props.history.push(map.TermsOnlyAccept);
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
        if (response.status === 500) {
          toggleAlertMessage(true);
          setAlertMessage("Server error");
        } else if (response.status === 401) {
          const { msg } = response.data;
          if (msg === "INVALID_EMAIL_OR_PASSWORD") {
            toggleAlertMessage(true);
            // This opens up a side channel, because hackers can intuit that this means the email exists in the system
            //setAlertMessage("The email or password may be wrong.");
            //setLoginWrong(true);
            setInvalidLogin(true);
          }
        }
      } else {
        toggleAlertMessage(true);
        setAlertMessage("Something may be wrong with the connection.");
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

  const renderPrivacyPolicy = () => {
    return (
      <TermsLink history={props.history} />
    );
  }

  return (
    <div className="login-desktop-page">
      <div className="left-part">
        <div className="logo">
          <LoginLogo />
        </div>
        <div className="button-box">
          <DesktopLoginForm
            email={email}
            isLogin={true}
            history={props.history}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            passwordHidden={passwordHidden}
            setHidden={setHidden}
            handleSubmit={handleLoginSubmit}
            resetPassword={async () => {
              try {
                if (email) {
                  if (isEmail(email)) {
                    try {
                      await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/auth/resetPassword/${email}`, {}, { withCredentials: true });
                    } catch { }
                    setEmailSended(true);
                  } else {
                    setInvalidEmail(true);
                  }
                } else {
                  setEmptyEmail(true);
                }
              } catch {
                // failed
              }
            }}
          />
        </div>
      </div>
      <div className="right-part">
        <div className="container">
          <PhoneIcon />
        </div>
        <LoginBricks />
        <div className="icons-container">
          <img alt="" className="glasses floating1" src="/images/login/rotatedGlasses.svg" />
          <TeachIcon className="floating3" />
          <SpriteIcon name="trowel-home" className="trowel-login text-theme-orange floating2" />
        </div>
      </div>
      {renderPrivacyPolicy()}
      <WrongLoginDialog isOpen={isLoginWrong} submit={() => register(email, password)} close={() => setLoginWrong(false)} />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alertShown}
        autoHideDuration={1500}
        onClose={() => toggleAlertMessage(false)}
        message={alertMessage}
        action={<React.Fragment></React.Fragment>}
      />
      <Dialog open={emailSended} onClose={() => setEmailSended(false)} className="dialog-box">
        <div className="dialog-header" style={{ marginBottom: 0 }}>
          <ListItem>
            <ListItemText
              primary="Now check your email for a password reset link"
              className="bold"
              style={{ minWidth: '30vw' }}
            />
            <ListItemAvatar style={{ padding: 0 }}>
              <Avatar className="circle-green">
                <SpriteIcon name="link" className="active text-white stroke-2 w-3 m-b-02" />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
          <div></div>
        </div>
      </Dialog>
      <Dialog open={emptyEmail} onClose={() => setEmptyEmail(false)} className="dialog-box">
        <div className="dialog-header" style={{ marginBottom: 0 }}>
          <ListItem>
            <ListItemText
              primary="You need to enter an email before clicking this"
              className="bold"
              style={{ minWidth: '30vw' }}
            />
            <ListItemAvatar style={{ padding: 0 }}>
              <Avatar className="circle-orange">
                <SpriteIcon name="alert-triangle" className="active text-white stroke-2 w-3 m-b-02" />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
          <div></div>
        </div>
      </Dialog>
      <Dialog open={invalidEmail} onClose={() => setInvalidEmail(false)} className="dialog-box">
        <div className="dialog-header" style={{ marginBottom: 0 }}>
          <ListItem>
            <ListItemText
              primary="This email appears to be invalid"
              className="bold"
              style={{ minWidth: '30vw' }}
            />
            <ListItemAvatar style={{ padding: 0 }}>
              <Avatar className="circle-orange">
                <SpriteIcon name="alert-triangle" className="active text-white stroke-2 w-3 m-b-02" />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
          <div></div>
        </div>
      </Dialog>
      <Dialog open={invalidLogin} onClose={() => setInvalidLogin(false)} className="dialog-box width-50">
        <div className="dialog-header" style={{ marginBottom: 0 }}>
          <ListItem>
            <ListItemText
              primary="If you think you have already signed up, but are unable to access your account, please tell us by clicking the help button in the bottom left of this screen"
              className="bold"
              style={{ minWidth: '30vw' }}
            />
            <ListItemAvatar style={{ padding: 0 }}>
              <Avatar className="circle-orange">
                <SpriteIcon name="alert-triangle" className="active text-white stroke-2 w-3 m-b-02" />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
          <div></div>
        </div>
      </Dialog>
      <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
    </div>
  );
};

export default connector(EmailLoginDesktopPage);
