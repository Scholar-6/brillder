import React from "react";
import { Grid } from "@material-ui/core";


const LoginLogo: React.FC<any> = () => {
  return (
    <Grid container style={{ height: "100%" }} justify="center" alignItems="center">
      <div>
        <img
          alt="Logo" src="/images/choose-login/logo.png"
          className="logo-image"
        />
        <Grid container justify="center">
          <img
            alt="Logo" src="/images/choose-user/brillder-white-text.svg"
            className="logo-text-image"
          />
        </Grid>
      </div>
    </Grid>
  );
}

export default LoginLogo;
