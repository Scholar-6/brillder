import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface RegisterButtonProps {
  onClick(): void;
}

const RegisterDesktopButton: React.FC<RegisterButtonProps> = props => {
  return (
    <button className="email-button svgOnHover" onClick={props.onClick}>
      <SpriteIcon name="email" className="active" />
      <span>Sign in with email</span>
    </button>
  );
};

export default RegisterDesktopButton;
