import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface Props {
  label: string;
  onClick(link: string): void;
}

const GoogleDesktopButtonV2: React.FC<Props> = ({label, onClick}) => {
  const googleLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/login`;

  return (
    <a className="google-button-desktop svgOnHover" onClick={() => onClick(googleLink)}>
      <SpriteIcon name="gmail" className="active" />
      <span>{label}</span>
    </a>
  );
};

export default GoogleDesktopButtonV2;
