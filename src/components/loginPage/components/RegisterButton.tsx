import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface RegisterButtonProps {
  label?: string;
  onClick(): void;
}

const RegisterButton: React.FC<RegisterButtonProps> = props => {
  return (
    <button className="email-button svgOnHover" onClick={props.onClick}>
      <SpriteIcon name="email" className="active" />
      <span>{props.label ? props.label : 'Sign in with email'}</span>
    </button>
  );
};

export default RegisterButton;
