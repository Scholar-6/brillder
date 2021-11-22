import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Button from "@material-ui/core/Button";
import { History } from "history";
import { Snackbar } from "@material-ui/core";

import map from "components/map";
import TermsLink from "components/baseComponents/TermsLink";
import actions from "redux/actions/auth";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { setUserPreference } from "services/axios/user";
import { RolePreference } from "model/user";
import WrongLoginDialog from "components/loginPage/components/WrongLoginDialog";

interface MobileLoginProps {
  token: string;
  email: string;
  history: History;
  setPolicyDialog(isOpen: boolean): void;
  loginSuccess(): void;
}

const MobileEmailActivatePage: React.FC<MobileLoginProps> = (props) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoginWrong, setLoginWrong] = React.useState(false);
  const [isSubmiting, setSubmiting] = React.useState(false);

  const { email } = props;

  const validateForm = () => {
    if (email.length > 0 && password.length > 0) {
      return true;
    }
    return "Fill required fields";
  };

  const resetPassword = async (password: string) => {
    try {
      if (password.length > 0) {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_HOST}/auth/changePassword/${props.token}`,
          { password: password },
          { withCredentials: true }
        );
        await setUserPreference(RolePreference.Student);
        props.history.push(map.TermsSignUp);
        props.loginSuccess();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleActivate = (event: any) => {
    if (isSubmiting) {
      return;
    }
    setSubmiting(true);

    event.preventDefault();

    let res = validateForm();
    if (res !== true) {
      toggleAlertMessage(true);
      setAlertMessage(res);
      return;
    }

    resetPassword(password);
    setSubmiting(false);
  };

  return (
    <div className="first-col">
      <div className="second-item">
        <div className="logo-box">
          <div className="logo-box-inner">
            <div className="logo-image mobile">
              <SpriteIcon name="login" className="active text-theme-orange" />
            </div>
          </div>
        </div>
        <form
          onSubmit={handleActivate}
          className="mobile-button-box content-box"
        >
          <div className="input-block">
            <input
              type="email" name="email"
              value={email}
              disabled={true}
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
              onChange={(e) => setPassword(e.target.value)}
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
              onClick={handleActivate}
            >
              Get Started
            </Button>
          </div>
          <div className="mobile-policy-text">
            <TermsLink history={props.history} />
          </div>
        </form>
      </div>
      <WrongLoginDialog
        isOpen={isLoginWrong}
        submit={() => {}}
        close={() => setLoginWrong(false)}
      />
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
const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

export default connect(null, mapDispatch)(MobileEmailActivatePage);
