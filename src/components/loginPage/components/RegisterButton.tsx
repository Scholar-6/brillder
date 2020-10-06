import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface RegisterButtonProps {
  onClick(): void;
}

const RegisterButton: React.FC<RegisterButtonProps> = props => {
  return (
    <button className="email-button svgOnHover" onClick={props.onClick}>
      <SpriteIcon name="email" className="active" />
      <span>Register &nbsp;|&nbsp; Sign in with email</span>
    </button>
  );
};

export default RegisterButton;
