import React, { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Checkbox, Snackbar } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import './SixthformLoginPage.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { login } from "services/axios/auth";
import WrongLoginDialog from 'components/loginPage/components/WrongLoginDialog';
import userActions from 'redux/actions/user';
import { User } from 'model/user';
import map from 'components/map';
import routes from './routes';


interface Props {
  getUser(): Promise<User>;
}

const SixthformLoginPage: React.FC<Props> = (props) => {
  const history = useHistory();

  const [highlightedTerms, setHighlightedTerms] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertShown, toggleAlertMessage] = useState(false);
  const [isLoginWrong, setLoginWrong] = useState(false);

  const sendLogin = async (email: string, password: string) => {
    let data = await login(email, password);
    if (!data.isError) {
      if (data === "OK") {
        history.push(map.SixthformChoices);
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
    if (termsAccepted) {
      setHighlightedTerms(false);
  
      const res = validateForm();
      if (res !== true) {
        toggleAlertMessage(true);
        setAlertMessage(res);
        return;
      }
  
      sendLogin(email, password);
    } else {
      setHighlightedTerms(true);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="content-box second-column">
        <div className="abolute-form-container">
          <div>
            <div className="font-40 flex-center title-container bold">
              <SpriteIcon name='sixth-login-hand' className="sixth-login-hand" />
              <div>Hey there!</div>
            </div>
            <div className="font-24 text-center">Register with Email</div>
            <input className="font-28 full-name-input" placeholder='Full name' onChange={e => setFullName(e.target.value)} />
            <input className="font-28" placeholder="Email" onChange={e => setEmail(e.target.value)} type="email" />
            <input className="font-28" placeholder="Password" onChange={e => setPassword(e.target.value)} type="password" />
            <div className={`terms-checkbox-container`}>
              <Checkbox required value={termsAccepted} onClick={() => setTermsAccepted(!termsAccepted)} />
              <div className="font-15">
                By signing up, I agree to the Scholar6 <span className="text-underline">Terms and Conditions</span>
              </div>
            </div>
            <button className="font-30 btn">Sign Up</button>
            <div className="button-box-v2">
              <div className="back-button font-25 bold" onClick={() => {
                history.push(routes.SignUp);
              }}>
                <SpriteIcon name="arrow-left" />
                Back
              </div>
            </div>
          </div>
        </div>
      </form>
      <WrongLoginDialog isOpen={isLoginWrong} submit={() => register(email, password)} close={() => setLoginWrong(false)} />
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
});

const connector = connect(null, mapDispatch)

export default connector(SixthformLoginPage);
