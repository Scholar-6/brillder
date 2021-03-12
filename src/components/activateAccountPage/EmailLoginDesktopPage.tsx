import React, { useState } from "react";
import { Snackbar } from "@material-ui/core";
import { connect } from "react-redux";
import { History } from "history";

import actions from "redux/actions/auth";
import LoginLogo from 'components/loginPage/components/LoginLogo';
import WrongLoginDialog from "components/loginPage/components/WrongLoginDialog";
import DesktopLoginForm from "components/loginPage/desktop/DesktopLoginForm";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TeachIcon from "components/mainPage/components/TeachIcon";
import PhoneIcon from "components/loginPage/desktop/PhoneIcon";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog";
import TermsLink from "components/baseComponents/TermsLink";

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

interface LoginProps {
  history: History;
  match: any;
  email: string;
  handleSubmit(e: any, password: string): void;
  loginSuccess(): void;
}

const EmailLoginDesktopPage: React.FC<LoginProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
  const [isPolicyOpen, setPolicyDialog] = useState(initPolicyOpen);

  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [email, setEmail] = useState(props.email ? props.email : "");
  const [password, setPassword] = useState("");
  const [isLoginWrong, setLoginWrong] = React.useState(false);

  const renderPrivacyPolicy = () => {
    return (
      <TermsLink history={props.history}/>
    );
  }

  return (
    <div className="login-desktop-page email-desktop-page">
      <div className="left-part">
        <div className="logo">
          <LoginLogo />
        </div>
        <div className="button-box">
          <DesktopLoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            passwordHidden={passwordHidden}
            setHidden={setHidden}
            handleSubmit={(e) => props.handleSubmit(e, password)}
            register={() => {}}
          />
        </div>
      </div>
      <div className="right-part">
        <div className="container">
          <PhoneIcon />
        </div>
        <div className="bricks-container">
          <div className="inner">
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
              <div className="block" />
            </div>
            <div className="row">
              <div className="block" />
              <div className="block" />
            </div>
          </div>
        </div>
        <div className="icons-container">
          <img alt="" className="glasses floating1" src="/images/login/rotatedGlasses.svg" />
          <TeachIcon className="floating3" />
          <SpriteIcon name="trowel-home" className="trowel-login text-theme-orange floating2" />
        </div>
      </div>
      {renderPrivacyPolicy()}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alertShown}
        autoHideDuration={1500}
        onClose={() => toggleAlertMessage(false)}
        message={alertMessage}
        action={<React.Fragment></React.Fragment>}
      />
      <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
    </div>
  );
};

export default connector(EmailLoginDesktopPage);
