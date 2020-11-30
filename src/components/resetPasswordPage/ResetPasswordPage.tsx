import { Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import axios from 'axios';
import PageLoader from 'components/baseComponents/loaders/pageLoader';
import map from 'components/map';
import TypingInput from 'components/loginPage/components/TypingInput';
import VisibilityIcon from "@material-ui/icons/Visibility";
import LoginLogo from 'components/loginPage/components/LoginLogo';

interface ResetPasswordPageProps {
  
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = props => {
  const [valid, setValid] = React.useState<boolean>();
  const [passwordHidden, setPasswordHidden] = React.useState<boolean>(true);
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token");

  const verifyToken = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/auth/verifyResetPassword/${token}`);
      setValid(true);
    } catch(e) {
      console.log(e.response.statusCode);
      setValid(false);
    }
  }

  useEffect(() => {
    verifyToken();
  }, [token, setValid]);

  const resetPassword = async () => {
    try {
      if(password === confirmPassword) {
        await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/auth/changePassword/${token}`, { password: password });
        setValid(false);
      }
    } catch(e) {
      console.log(e);
    }
  }

  if(!valid && valid !== false) {
    return <PageLoader content="Checking token..." />
  }

  return (
    <Grid className="auth-page login-page" container item justify="center" alignItems="center">
      {valid ?
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
              <div className="content-box expanded">
                <div className="input-block">
                  <TypingInput
                    required
                    type={passwordHidden ? "password" : "text"}
                    className="login-field password"
                    value={password}
                    placeholder="New Password"
                    onChange={setPassword}
                  />
                  <div className="hide-password-icon-container">
                    <VisibilityIcon
                      className="hide-password-icon"
                      onClick={() => setPasswordHidden(p => !p)}
                    />
                  </div>
                </div>
                <div className="input-block">
                  <TypingInput
                    required
                    type={passwordHidden ? "password" : "text"}
                    className="login-field password"
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={setConfirmPassword}
                  />
                  <div className="hide-password-icon-container">
                    <VisibilityIcon
                      className="hide-password-icon"
                      onClick={() => setPasswordHidden(p => !p)}
                    />
                  </div>
                </div>
                <div className="input-block">
                  <div className="button-box">
                    <button type="submit" className="reset-password-button" onClick={resetPassword}>Reset Password</button>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid container direction="row" className="third-row">
            <div className="first-col"></div>
            <div className="second-col"></div>
            <div className="third-col"></div>
          </Grid>
        </div>
        : <Redirect to={map.Login} />}
    </Grid>
  );
};

export default ResetPasswordPage;