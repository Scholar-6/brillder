import React, { useState } from "react";
import { History } from "history";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import TermsLink from "components/baseComponents/TermsLink"
import TypingLabel from "components/baseComponents/TypingLabel";
import EmailActivateDesktopPage from "./EmailActivateDesktopPage";
import { ActivateAccount } from "components/loginPage/desktop/routes";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog"; // TODO: Reuse this for the cookie Popup

export enum LoginPage {
  Default,
  Join,
  Register
}

interface LoginProps {
  history: History;
  token: string | null;
  email: string;
  match: any;
}

const MobileTheme = React.lazy(() => import('../loginPage/themes/LoginPageMobileTheme'));
const TabletTheme = React.lazy(() => import('../loginPage/themes/LoginPageTabletTheme'));
const DesktopTheme = React.lazy(() => import('../loginPage/themes/LoginPageDesktopTheme'));

const DesktopActivateAccountPage: React.FC<LoginProps> = (props) => {
  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
  const [isPolicyOpen, setPolicyDialog] = useState(initPolicyOpen);
  const { history } = props;

  return (
    <React.Suspense fallback={<></>}>
      {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
      <div className="login-desktop-page">
        <div className="left-part-join">
          <h1>
            <TypingLabel onEnd={() => { }} label="Join the revolution" />
          </h1>
          <div className="image-container spinning">
            <img alt="" src="/images/login/PhoneWheellogin.svg" />
          </div>
        </div>
        <Switch>
          <Route exact path={ActivateAccount}>
            <EmailActivateDesktopPage history={history} email={props.email} token={props.token || ''} />
          </Route>
        </Switch>
        <TermsLink history={history} />
        <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
      </div>
    </React.Suspense>
  );
};

export default DesktopActivateAccountPage;
