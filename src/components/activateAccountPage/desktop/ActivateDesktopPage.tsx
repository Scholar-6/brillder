import React from "react";
import { connect } from "react-redux";
import { History } from "history";

import actions from "redux/actions/auth";

import LoginLogo from 'components/loginPage/components/LoginLogo';
import map from "components/map";
import GoogleDesktopButton from "components/loginPage/desktop/GoogleDesktopButton";
import RegisterDesktopButton from "components/loginPage/desktop/RegisterDesktopButton";

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

interface LoginProps {
  history: History;
  token: string | null;
}

const ActivateDesktopPage: React.FC<LoginProps> = (props) => {
  return (
    <div className="left-part right">
      <div className="logo">
        <LoginLogo />
      </div>
      <div className="button-box">
        <div>
          <div className="button-box">
            <GoogleDesktopButton label="Activate with Google" />
          </div>
          <div className="button-box">
            <RegisterDesktopButton label="Activate with email" onClick={() => props.history.push(map.ActivateAccountEmail + "?token=" + props.token)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(ActivateDesktopPage);
