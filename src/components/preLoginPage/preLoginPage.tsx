import React from "react";
import update from 'immutability-helper';
import { Button, Grid } from "@material-ui/core";

import './preLoginPage.scss'
import host from '../../hostname';


enum LoginType {
  Student = 1,
  Teacher = 2,
  Builder = 3
}

function PreLoginPage(props: any) {
  const [userType, setUserType] = React.useState(0)
  const selectLoginType = (type: LoginType) => {
    setUserType(update(userType, { $set: type }));
  }

  const moveToLogin = () => {
    props.history.push('/login?userType=' + userType)
  }

  if (userType == 0) {
    return (
      <Grid className="pre-login-page" container item justify="center" alignItems="center">
        <div className="login-container">
          <div className="login-logo">
            <img src="/images/lflogo.png" alt="lol" />
          </div>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => selectLoginType(LoginType.Student)} className="user-type-btn">
                <img src="/images/lflogo.png" className="user-type-img" />
                <span className="user-type-name">Student</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => selectLoginType(LoginType.Teacher)} className="user-type-btn">
                <img src="/images/lflogo.png" className="user-type-img rotate-180" />
                <span className="user-type-name">Teacher</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => selectLoginType(LoginType.Builder)} className="user-type-btn">
                <img src="/images/lflogo.png" className="user-type-img rotate-90" />
                <span className="user-type-name">Builder</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <img className="fotter" src="/images/brillder-2-logo.png" /><br />
            </Grid>
          </Grid>
        </div>
      </Grid>
    );
  } else {

    return (
      <Grid className="pre-login-page" container item justify="center" alignItems="center">
        <div className="login-container">
          <div className="login-logo">
            <img src="/images/lflogo.png" alt="lol" />
          </div>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button className="email-button" onClick={moveToLogin}>
                <img className="email-icon" alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/mail.svg" />
                <span className="email-button-text">Sign in with email</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button className="google-button" href={host.BACKEND_HOST + '/auth/google'}>
                <img className="google-icon" alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"/>
                <span className="google-button-text">Sign in with Google</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <img className="fotter" src="/images/brillder-2-logo.png" /><br />
            </Grid>
          </Grid>
        </div>
      </Grid>
    );
  }
}

export default PreLoginPage
