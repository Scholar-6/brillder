import React from "react";
import sprite from "assets/img/icons-sprite.svg";

interface RegisterButtonProps {
  onClick(): void;
}

const RegisterButton: React.FC<RegisterButtonProps> = props => {
  return (
    <button className="email-button svgOnHover" onClick={props.onClick}>
      <svg className="svg active">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#email"} />
      </svg>
      <span>Register &nbsp;|&nbsp; Sign in with email</span>
    </button>
  );
};

export default RegisterButton;
