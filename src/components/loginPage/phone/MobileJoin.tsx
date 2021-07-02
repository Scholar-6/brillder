import React from "react";
import { History } from "history";
import TermsLink from "components/baseComponents/TermsLink";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import GoogleButton from "../components/GoogleButton";
import RegisterButton from "../components/RegisterButton";
import { RegisterPage } from "../desktop/routes";


interface MobileLoginProps {
  history: History;
}


const MobileJoinPage: React.FC<MobileLoginProps> = (props) => {
  return (
    <div className="first-col mobile-register mobile-join">
      <div className="second-item">
        <div className="logo-box">
          <div>
            <div className="flex-center h-images-container">
              <SpriteIcon name="brain-white-thunder" />
              <div className="brain-container">
                <SpriteIcon name="logo" className="active text-theme-orange" onClick={() => props.history.push(map.Login)} />
                <p className="d-label">Brillder</p>
              </div>
            </div>
            <p className="bold g-big">Join the revolution.</p>
          </div>
        </div>
        <div className="mobile-button-box button-box m-register-box">
          <div className="button-box">
            <div className="text-box gg-text-box">
              <span>Already a member?</span>
              <div className="join-button fe-sign-in" onClick={() => props.history.push(map.Login)}>
                <SpriteIcon name="arrow-left" />
                Sign in
              </div>
            </div>
          </div>
          <GoogleButton label="Register with Google" />
          <RegisterButton label="Register with email" onClick={() => props.history.push(RegisterPage)} />
          <div className="mobile-policy-text">
            <TermsLink history={props.history} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileJoinPage;
