import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import './SixthformLoginPage.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { login } from "services/axios/auth";
import userActions from 'redux/actions/user';
import actions from "redux/actions/auth";
import { User } from 'model/user';
import map from 'components/map';
import routes from './routes';


interface Props {
  getUser(): Promise<User>;
  loginSuccess(): void;
}

const SixthformSignInPage: React.FC<Props> = (props) => {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);

  const sendLogin = async (email: string, password: string) => {
    let data = await login(email, password);
    if (!data.isError) {
      if (data === "OK") {
        props.loginSuccess();
        history.push(map.SixthformChoices);
      } else {
        let { msg } = data;
        if (!msg) {
          const { errors } = data;
          msg = errors[0].msg;
        }
        toggleAlertMessage(true);
        setAlertMessage(msg);
      }
    } else {
      const { response } = data;
      if (response) {
        if (response.status === 500) {
          toggleAlertMessage(true);
          setAlertMessage("Server error");
        } else if (response.status === 401) {
          const { msg } = response.data;
          if (msg === "INVALID_EMAIL_OR_PASSWORD") {
            setAlertMessage("Email or Password is wrong");
            // register(email, password);
          }
        } else {
          history.push()
        }
      } else {
        // register
        setAlertMessage("Network error");
      }
    }
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
    <div>
      <form onSubmit={handleSubmit} className="content-box second-column">
        <div className="abolute-form-container">
          <div>
            <div className="font-40 flex-center title-container bold">
              <SpriteIcon name='sixth-login-hand' className="sixth-login-hand" />
              <div>Welcome back!</div>
            </div>
            <div className="font-24 text-center">Sign in to your account</div>
            <input className="font-28" placeholder="Email" onChange={e => setEmail(e.target.value)} type="email" />
            <input className="font-28" placeholder="Password" onChange={e => setPassword(e.target.value)} type="password" />
            <button className="font-30 btn sign-in-btn">Sign In</button>
            <div className="line-container flex-center">
              <div className="line" />
              <div className="font-20">OR</div>
              <div className="line" />
            </div>
            <a className="google-button-desktop font-25 bold" href={`${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/sixthform-choices`}>
              <SpriteIcon name="gmail" className="active" />
              <span>Google</span>
            </a>
            <a className="microsoft-button-v5 font-25 bold" href={`${process.env.REACT_APP_BACKEND_HOST}/auth/microsoft/login/sixthform-choices`}>
              <img alt="" src="/images/microsoft.png" />
              <span>School or Institution (Microsoft)</span>
            </a>
            <div className="sign-up-link font-20" onClick={() => history.push(routes.SignUp)}>
              Don’t have an account yet? <span className="text-underline">Sign up here</span>
            </div>
          </div>
        </div>
      </form>
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
  getUser: () => dispatch(userActions.getUser()),
  loginSuccess: () => dispatch(actions.loginSuccess()),
});


const connector = connect(null, mapDispatch);

export default connector(SixthformSignInPage);
