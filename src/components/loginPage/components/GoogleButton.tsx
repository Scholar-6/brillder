import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

const GoogleButton: React.FC = () => {
  const googleLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/build`;

  return (
    <a className="btn btn-xl bg-white google-button svgOnHover" href={googleLink}>
      <SpriteIcon name="gmail" className="active" />
      <span>Register &nbsp;|&nbsp; Sign in with Google</span>
    </a>
  );
};

export default GoogleButton;
