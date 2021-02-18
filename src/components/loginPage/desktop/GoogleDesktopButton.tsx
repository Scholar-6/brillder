import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

const GoogleDesktopButton: React.FC = () => {
  const googleLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/build`;

  return (
    <a className="google-button-desktop svgOnHover" href={googleLink}>
      <SpriteIcon name="gmail" className="active" />
      <span>Sign in with Google</span>
    </a>
  );
};

export default GoogleDesktopButton;
