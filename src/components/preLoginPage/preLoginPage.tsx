import React from "react";
import update from 'immutability-helper';
import { Button, Grid } from "@material-ui/core";

import './preLoginPage.scss'


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

  if (userType === 0) {
    return (
      <Grid className="pre-login-page" style={{height: '100%'}} container item justify="center" alignItems="center">
        <Grid container className="pre-login-image-container" justify="center" item xs={6} alignItems="center">
          <Grid container className="pre-login-image-container2" justify="center" item xs={12} alignItems="center">
            <Grid container className="pre-login-image-container3" justify="center" style={{position: "relative"}}>
              <img alt="Logo" src="/images/BrixLogo.png" className="pre-login-image" />
              <Grid container direction="row" justify="center" className="pre-login-text" style={{position: "absolute", bottom: 0}}>
                <p>
                  A &nbsp; S C H O L A R &nbsp; 6 &nbsp; T E C H &nbsp; P R O D U C T
                </p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={6}>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => selectLoginType(LoginType.Student)} className="user-type-btn">
                <span className="user-type-name">S t u d e n t</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => selectLoginType(LoginType.Teacher)} className="user-type-btn">
                <span className="user-type-name">T e a c h e r</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <Button onClick={() => selectLoginType(LoginType.Builder)} className="user-type-btn">
                <span className="user-type-name">B u i l d e r</span>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  } else {

    return (
      <Grid className="pre-login-page" container item justify="center" alignItems="center">
        <div className="login-container">
          <div className="login-logo">
            <img src="/images/lflogo.png" alt="logo" />
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
                <img alt="google-icon" className="google-icon" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"/>
                <span className="google-button-text">Sign in with Google</span>
              </Button>
            </Grid>
          </Grid>
          <Grid container direction="row">
            <Grid container item xs={12} justify="center">
              <img alt="fotter-logo" className="fotter-image" src="/images/brillder-2-logo.png" /><br />
            </Grid>
          </Grid>
        </div>
      </Grid>
    );
  }
}

export default PreLoginPage
