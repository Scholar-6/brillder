import React from "react";
import Grid from "@material-ui/core/Grid";

import './logoPage.scss';


function LogoPage() {
  return (
    <Grid container direction="row" className="logo-page" alignItems="center">
      <Grid container justify="center" item xs={12} style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center">
          <img src="/images/choose-login/logo.png" className="brick-logo-image" alt="brix-logo" />
          <Grid container justify="center">
            <img alt="Logo" src="/images/choose-user/brillder-red-text.svg" className="logo-mobile-text-image" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LogoPage
