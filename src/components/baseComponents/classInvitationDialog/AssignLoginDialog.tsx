import React from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import { Dialog, Grid } from '@material-ui/core';

import './ClassInvitationDialog.scss';
import actions from "redux/actions/auth";
import SpriteIcon from '../SpriteIcon';
import { login } from "services/axios/auth";
import { getTerms } from 'services/axios/terms';
import { afterLoginorRegister } from 'services/afterLogin';
import map from 'components/map';


interface Props {
  history: any;
  close(): void;
  loginSuccess(userId: number): void;
}

export interface QuickAssigment {
  accepted: boolean;
  typedName: string;
  brick: any;
  classroom: any;
}

const AssignLoginDialog: React.FC<Props> = props => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertShown, toggleAlertMessage] = React.useState(false);
  const [invalidLogin, setInvalidLogin] = React.useState(false);

  const validateForm = () => {
    if (email.length > 0 && password.length > 0) {
      return true;
    }
    return "Fill required fields";
  };

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
              props.history.push(map.TermsOnlyAccept);
            }
            afterLoginorRegister();
            props.loginSuccess(data.id);
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
  }

  const handleLoginSubmit = (event: any) => {
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
    <Dialog open={true} className="dialog-box link-copied-dialog signin-dialog-v5">
      <Grid className="classroom-invitation" container direction="column" alignItems="center">
        <h1 className="bold">Sign in to Brillder</h1>
        <div className="text-with-help big-bottom-margin">
          Select an option to sign in
        </div>
        <a className="google-button-v5 bold" href={`${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/login`}>
          <SpriteIcon name="gmail" className="active" />
          <span>Google</span>
        </a>
        <a className="microsoft-button-v5 bold" href={`${process.env.REACT_APP_BACKEND_HOST}/auth/microsoft/login`}>
          <img alt="" src="/images/microsoft.png" />
          <span>School or Institution (Microsoft)</span>
        </a>
        <div className="flex-center login-or-content">
          <div className="line"></div><div>OR</div><div className="line"></div>
        </div>
        <div className="text-with-help">
          Sign in with your email and password
        </div>
        <form
          onSubmit={handleLoginSubmit}
          className="mobile-button-box content-box"
        >
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button className="btn btn-md b-orange text-white" type="submit">
            Sign In
          </button>
        </form>
        <div className="back-btn-container">
          <div className="back-btn" onClick={props.close}>
            <SpriteIcon name='arrow-left' />
            Back
          </div>
        </div>
      </Grid>
    </Dialog>
  );
};

const mapDispatch = (dispatch: any) => ({
  loginSuccess: (userId: number) => dispatch(actions.loginSuccess(userId)),
});

const connector = connect(null, mapDispatch);

export default connector(AssignLoginDialog);
