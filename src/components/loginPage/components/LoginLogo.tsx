import React from "react";
import { Grid } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";


const LoginLogo: React.FC<any> = () => {
  return (
    <Grid container style={{ height: "100%" }} justify="center" alignItems="center">
      {/* <SpriteIcon name="login" className="logo-image active" /> */}
      <img alt="Logo" src="/images/choose-login/logo.png" className="logo-image"/>
      <Grid container justify="center">
        <img
          alt="Logo" src="/images/choose-user/brillder-white-text.svg"
          className="logo-text-image"
        />
      </Grid>
    </Grid>
  );
}

export default LoginLogo;
