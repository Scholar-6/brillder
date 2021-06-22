import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface Props {
  label?: string;
}

const GoogleButton: React.FC<Props> = (props) => {
  const googleLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/build`;

  return (
    <a className="google-button svgOnHover" href={googleLink}>
      <SpriteIcon name="gmail" className="active" />
      <span>{props.label ? props.label : 'Sign in with Google'}</span>
    </a>
  );
};

export default GoogleButton;
