import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface RegisterButtonProps {
  label: string;
  onClick(): void;
}

const RegisterDesktopButton: React.FC<RegisterButtonProps> = props => {
  return (
    <button className="btn btn-xl bg-theme-orange email-button svgOnHover" onClick={props.onClick}>
      <SpriteIcon name="email" className="active" />
      <span>{props.label}</span>
    </button>
  );
};

export default RegisterDesktopButton;
