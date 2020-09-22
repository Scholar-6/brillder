import React from "react";
import sprite from "assets/img/icons-sprite.svg";

const GoogleButton: React.FC = () => {
  const googleLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/build`;

  return (
    <a className="google-button svgOnHover" href={googleLink}>
      <svg className="svg active">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#gmail"} />
      </svg>
      <span>Register &nbsp;|&nbsp; Sign in with Google</span>
    </a>
  );
};

export default GoogleButton;
