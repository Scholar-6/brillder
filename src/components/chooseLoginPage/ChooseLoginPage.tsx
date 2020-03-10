import React from "react";
import { Button, Grid } from "@material-ui/core";

import './ChooseLoginPage.scss';
import { UserType } from '../model/userTypeModel';
import { Redirect } from "react-router-dom";


function ChooseLoginPage(props: any) {
  const moveToLogin = () => {
    props.history.push('/login?userType=' + userType)
  }

  function getUserTypeParam(param: string):UserType {
    var url_string =  window.location.href;
    var url = new URL(url_string);
    let userType = url.searchParams.get(param);
    if (userType) {
      return parseInt(userType);
    }
    return UserType.None;
  }

  const userType = getUserTypeParam('userType');

  if (userType === UserType.Builder || userType === UserType.Student) {
    return (
      <Grid className="pre-login-page" container item justify="center" alignItems="center">
        <div className="login-container">
          <div className="login-logo">
            <img src="/images/lflogo.png" className="logo-img" alt="logo" />
          </div>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button className="email-button" onClick={moveToLogin}>
                <img className="email-icon" alt="mail" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg" />
                <span className="email-button-text">Sign in with email</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button className="google-button" href={process.env.REACT_APP_BACKEND_HOST + '/auth/google'}>
                <img alt="google-icon" className="google-icon" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
                <span className="google-button-text">Sign in with Google</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <img alt="footer-logo" className="footer-image" src="/images/brillder-2-logo.png" /><br />
            </Grid>
          </Grid>
        </div>
      </Grid>
    );
  }

  return <Redirect to="/choose-user" />
}

export default ChooseLoginPage
