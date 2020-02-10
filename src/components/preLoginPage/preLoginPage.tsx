import React from "react";
import './preLoginPage.scss'
import { Button, Grid } from "@material-ui/core";

function PreLoginPage(props: any) {
  const signIn = (number: number) => {

  }

  return (
    <Grid className="pre-login-page" container item justify="center" alignItems="center">
      <div className="login-container">
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            <Button onClick={() => signIn(1)} className="user-type-btn">
              <img src="/images/lflogo.png" className="user-type-img" />
              <span className="user-type-name">Student</span>
            </Button>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            <Button onClick={() => signIn(2)} className="user-type-btn">
              <img src="/images/lflogo.png" className="user-type-img rotate-180" />
              <span className="user-type-name">Teacher</span>
          </Button>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid container item xs={12} justify="center">
            <Button onClick={() => signIn(3)} className="user-type-btn">
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
}

export default PreLoginPage
