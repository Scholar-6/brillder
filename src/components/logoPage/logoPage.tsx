import React from "react";
import Grid from "@material-ui/core/Grid";

function LogoPage() {
  return (
    <Grid container direction="row" style={{ height: '100%', background: '#06215C' }} alignItems="center">
      <Grid container justify="center" item xs={12} style={{ height: '100%' }} alignItems="center">
        <img src="/images/BrixLogo.png" style={{ height: '80%', width: '100%' }} alt="brix-logo" />
      </Grid>
    </Grid>
  );
}

export default LogoPage
