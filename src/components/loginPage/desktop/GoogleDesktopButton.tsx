import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface Props {
  label: string;
}

const GoogleDesktopButton: React.FC<Props> = ({label}) => {
  const googleLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/build`;

  return (
    <a className="google-button-desktop svgOnHover" href={googleLink}>
      <SpriteIcon name="gmail" className="active" />
      <span>{label}</span>
    </a>
  );
};

export default GoogleDesktopButton;
