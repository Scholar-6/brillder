import React from "react";
import { Grid } from "@material-ui/core";
import LogoImg from "public/images/choose-login/logo.png";
import WhiteText from "public/images/choose-user/brillder-white-text.svg";

const LoginLogo: React.FC<any> = () => {
  return (
    <Grid container style={{ height: "100%" }} justify="center" alignItems="center">
      <div>
        <img
          alt="Logo" src={LogoImg}
          className="logo-image"
        />
        <Grid container justify="center">
          <img
            alt="Logo" src={WhiteText}
            className="logo-text-image"
          />
        </Grid>
      </div>
    </Grid>
  );
}

export default LoginLogo;
