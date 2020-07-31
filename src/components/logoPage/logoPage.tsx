import React from "react";
import Grid from "@material-ui/core/Grid";

import './logoPage.scss';


function LogoPage() {
  return (
    <div className="logo-page">
      <img src="/images/choose-login/logo.png" className="brick-logo-image" alt="brix-logo" />
      <img alt="Logo" src="/images/choose-user/brillder-red-text.svg" className="logo-mobile-text-image" />
    </div>
  );
}

export default LogoPage
