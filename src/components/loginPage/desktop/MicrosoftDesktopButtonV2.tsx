import React from "react";

interface Props {
  returnUrl?: number;
  onClick(link: string): void;
}

const MicrosoftDesktopButtonV2: React.FC<Props> = ({returnUrl, onClick}) => {
  let microsoftLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/microsoft/login`;

  if (returnUrl) {
    microsoftLink += returnUrl;
  }

  return (
    <a className="google-button-desktop microsoft-btn svgOnHover" onClick={() => onClick(microsoftLink)}>
      <img alt="" src="/images/microsoft.png" />
      <span>School or Institution (Microsoft)</span>
    </a>
  );
};

export default MicrosoftDesktopButtonV2;
