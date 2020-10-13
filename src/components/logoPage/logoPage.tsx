import React from "react";

import './logoPage.scss';
import LogoImg from "assets/img/choose-login/logo.png";
import RedText from "assets/img/choose-user/brillder-red-text.svg"

function LogoPage() {
  return (
    <div className="logo-page">
      <img src={LogoImg} className="brick-logo-image" alt="brix-logo" />
      <img alt="Logo" src={RedText} className="logo-mobile-text-image" />
    </div>
  );
}

export default LogoPage
