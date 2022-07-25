import React from "react";

interface Props {
  label?: string;
}

const MicrosoftButton: React.FC<Props> = (props) => {
  const googleLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/build`;

  return (
    <a className="google-button microsoft-button svgOnHover" href={googleLink}>
      <span>School or Institution (Microsoft)</span>
    </a>
  );
};

export default MicrosoftButton;
