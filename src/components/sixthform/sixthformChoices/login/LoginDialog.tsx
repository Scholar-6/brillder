import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Dialog, Snackbar } from '@material-ui/core';

import './LoginDialog.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { login } from "services/axios/auth";
import WrongLoginDialog from 'components/loginPage/components/WrongLoginDialog';
import userActions from 'redux/actions/user';
import { User } from 'model/user';


interface Props {
  isOpen: boolean;
  loginSuccess(user: User): void;
  getUser(): Promise<User>;
}

const LoginDialog: React.FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [isLoginWrong, setLoginWrong] = useState(false);

  const sendLogin = async (email: string, password: string) => {
    let data = await login(email, password);
    if (!data.isError) {
      if (data === "OK") {
        const user = await props.getUser();
        props.loginSuccess(user);
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
    let data = {
      email, password, confirmPassword: password
    } as any;

    axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/auth/SignUp`, data, { withCredentials: true }
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
      setAlertMessage("An account with this email address already exists. Please return to the homepage and use the Login button, or use click Help to send us a message.");
    });
  };

  const validateForm = () => {
    if (email.length > 0 && password.length > 0) {
      return true;
    }
    return "Fill required fields";
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    let res = validateForm();
    if (res !== true) {
      toggleAlertMessage(true);
      setAlertMessage(res);
      return;
    }

    sendLogin(email, password);
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={() => { }}
      className="dialog-box login-sixthform-dialog"
    >
      <div className="popup-container">
        <div className="first-column relative">
          <SpriteIcon name="scholar6-white-logo" className="white-logo-r23" />
          <SpriteIcon name="red-shape-icon-r1" className="red-shape-r23" />
          <img src="/images/login-background.png" />
          <div className="study-text font-30">
            What will you study in<br /> the sixth form?
          </div>
        </div>
        <form onSubmit={handleSubmit} className="content-box second-column">
          <div className="abolute-form-container">
            <div>
              <div className="font-40 text-center bold">Hey there!</div>
              <div className="font-24 text-center">Register with Email</div>
              <input className="font-28" placeholder='Full name' />
              <input className="font-28" placeholder="Email" onChange={e => setEmail(e.target.value)} type="email" />
              <input className="font-28" placeholder="Password" onChange={e => setPassword(e.target.value)} type="password" />
              <button className="font-30 btn">Sign Up</button>
            </div>
          </div>
        </form>
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
    </Dialog>
  );
}

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

const connector = connect(null, mapDispatch)

export default connector(LoginDialog);
