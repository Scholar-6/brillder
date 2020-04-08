import React from "react";
import Grid from "@material-ui/core/Grid";

import './logoPage.scss';


function LogoPage() {
  return (
    <Grid container direction="row" className="logo-page" alignItems="center">
      <Grid container justify="center" item xs={12} style={{ height: '100%' }} alignItems="center">
        <img src="/images/BrixLogo.png" style={{ width: '70%' }} alt="brix-logo" />
      </Grid>
    </Grid>
  );
}

export default LogoPage
