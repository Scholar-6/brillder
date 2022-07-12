import React from "react";


const MicrosoftDesktopButton: React.FC = () => {
  const microsoftLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/microsoft/login/onboarding/terms?onlyAcceptTerms=true`;

  return (
    <a className="google-button-desktop microsoft-btn svgOnHover" href={microsoftLink}>
      <img alt="" src="/images/microsoft.png" />
      <span>School or Institution (Microsoft)</span>
    </a>
  );
};

export default MicrosoftDesktopButton;
