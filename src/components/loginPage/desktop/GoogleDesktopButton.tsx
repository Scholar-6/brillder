import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { ReduxCombinedState } from "redux/reducers";
import { connect } from "react-redux";

interface Props {
  intendedPath: string;
  label: string;
}

const GoogleDesktopButton: React.FC<Props> = ({label, intendedPath}) => {
  const googleLink = `${process.env.REACT_APP_BACKEND_HOST}/auth/google/login/onboarding/terms`;

  return (
    <a className="google-button-desktop svgOnHover" href={googleLink}>
      <SpriteIcon name="gmail" className="active" />
      <span>{label}</span>
    </a>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  intendedPath: state.auth.intendedPath,
});

export default connect(mapState)(GoogleDesktopButton);
