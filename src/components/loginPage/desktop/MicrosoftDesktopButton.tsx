import React from "react";

interface Props {
  returnUrl?: number;
}

const MicrosoftDesktopButton: React.FC<Props> = ({returnUrl}) => {
  let microsoftLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/microsoft/login`;

  if (returnUrl) {
    microsoftLink += returnUrl;
  }

  return (
    <a className="google-button-desktop microsoft-btn svgOnHover" href={microsoftLink}>
      <img alt="" src="/images/microsoft.png" />
      <span>School or Institution (Microsoft)</span>
    </a>
  );
};

export default MicrosoftDesktopButton;
