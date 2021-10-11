import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { History } from "history";
import { Snackbar } from "@material-ui/core";
import axios from "axios";

import TermsLink from "components/baseComponents/TermsLink";
import actions from "redux/actions/auth";
import { login } from "services/axios/auth";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import DesktopLoginForm from "../desktop/DesktopLoginForm";
import { isPhone } from "services/phone";
import { hideZendesk, showZendesk } from "services/zendesk";


interface MobileLoginProps {
  history: History;
  email?: string;
  loginSuccess(): void;
}

const MobileRegisterPage:React.FC<MobileLoginProps> = (props) => {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [passwordHidden, setHidden] = useState(true);
  const [email, setEmail] = useState(props.email || "");
  const [password, setPassword] = useState("");
  const [keyboardShown, mobileKeyboard] =  useState(false);
  const [originalHeight] = useState(window.innerHeight);

  const resizeHandler = () => {
    if (originalHeight > window.innerHeight + 60) {
      hideZendesk();
      mobileKeyboard(true);
    } else {
      mobileKeyboard(false);
      showZendesk();
    }
  }

  useEffect(() => {
    if (isPhone()) {
      window.addEventListener("resize", resizeHandler);

      return () => {
        window.removeEventListener("resize", resizeHandler);
      }
    }
  /*eslint-disable-next-line*/
  }, []);

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
    <div className="first-col mobile-register">
      <div className="second-item">
        <div className="logo-box">
          <div>
            <div className="flex-center h-images-container">
              <SpriteIcon name="brain-white-thunder" />
              <div className="brain-container">
                <SpriteIcon name="logo" className="active text-theme-orange" onClick={() => props.history.push(map.Login)} />
                <p className="d-label">Brillder</p>
              </div>
            </div>
            <p className="bold g-big">Join the revolution.</p>
          </div>
        </div>
        <div className="mobile-button-box button-box m-register-box">
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
          {!keyboardShown &&
          <div className="mobile-policy-text">
            <TermsLink history={props.history} />
          </div>}
        </div>
      </div>
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
}

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

export default connector(MobileRegisterPage);
