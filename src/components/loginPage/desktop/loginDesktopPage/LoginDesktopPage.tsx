import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { History } from "history";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { isMobile } from "react-device-detect";

import './LoginDesktopPage.scss';
import actions from "redux/actions/auth";
import LoginLogo from '../../components/LoginLogo';
import map from "components/map";
import GoogleDesktopButton from "../GoogleDesktopButton";
import RegisterDesktopButton from "../RegisterDesktopButton";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import TermsLink from "components/baseComponents/TermsLink"
import TeachIcon from "components/mainPage/components/TeachIcon";
import PhoneIcon from "../PhoneIcon";
import TypingLabel from "components/baseComponents/TypingLabel";
import EmailRegisterDesktopPage from "../EmailRegisterDesktopPage";
import Delayed from "components/services/Delayed";
import { FirstPage, EmailSignPage, JoinPage, RegisterPage, LibraryRegisterPage } from "../routes";
import PolicyDialog from "components/baseComponents/policyDialog/PolicyDialog"; // TODO: Reuse this for the cookie Popup
import { GetOrigin } from "localStorage/origin";
import MicrosoftDesktopButton from "../MicrosoftDesktopButton";
import LibraryDesktopButton from "../LibraryDesktopButton";
import FlexLinesWithOr from "components/baseComponents/FlexLinesWithOr/FlexLinesWithOr";


const DesktopTheme = React.lazy(() => import('./themes/LoginDesktopTheme'));

export enum LoginPage {
  Default,
  Join,
  Register,
  LibraryRegister
}

interface LoginProps {
  loginSuccess(): void;
  history: History;
  match: any;
}

const LoginDesktopPage: React.FC<LoginProps> = (props) => {
  const [isLibrary, setLibraryOrigin] = useState(false);

  useEffect(() => {
    var origin = GetOrigin();
    if (origin === 'library') {
      setLibraryOrigin(true);
    } else {
      // get it from query string
    }    
  }, []);

  let initPolicyOpen = false;
  if (props.match.params.privacy && props.match.params.privacy === "privacy-policy") {
    initPolicyOpen = true;
  }
  const [isPolicyOpen, setPolicyDialog] = useState(initPolicyOpen);
  const { history } = props;
  let page = LoginPage.Default;
  const { pathname } = history.location;
  if (pathname === JoinPage) {
    page = LoginPage.Join;
  } else if (pathname === RegisterPage) {
    page = LoginPage.Register;
  } else if (pathname === LibraryRegisterPage) {
    page = LoginPage.LibraryRegister;
  }
  

  const moveToFirstPage = () => history.push(FirstPage)
  const moveToEmailLogin = () => history.push(EmailSignPage);
  const moveToJoin = () => history.push(JoinPage);
  const moveToRegister = () => history.push(RegisterPage);
  const moveToLibraryRegister = () => history.push(LibraryRegisterPage);

  return (
    <React.Suspense fallback={<></>}>
      {!isMobile && <DesktopTheme />}
      <div className="login-desktop-page">
        {(page === LoginPage.Join || page === LoginPage.Register || page === LoginPage.LibraryRegister) &&
          <div className="left-part-join">
            <h1>
              <TypingLabel onEnd={() => { }} label={(isLibrary || page === LoginPage.LibraryRegister) ? "Sign up for a free Brillder library account today" : "Join the revolution"} />
            </h1>
            <div className="image-container spinning">
              <img alt="" src="/images/login/PhoneWheellogin.svg" />
            </div>
          </div>}
        <Switch>
          <Route exact path={LibraryRegisterPage}>
            <EmailRegisterDesktopPage history={history} isLibrary={true} />
          </Route>
          <Route exact path={RegisterPage}>
            <EmailRegisterDesktopPage history={history} />
          </Route>
          <Route exact path={JoinPage}>
            <div className="left-part right">
              <div className="logo">
                <LoginLogo />
              </div>
              <div className="button-box">
                <GoogleDesktopButton label="Register with Google" />
              </div>
              <div className="button-box m-t-3vh">
                <MicrosoftDesktopButton />
              </div>
              <div className="button-box">
                <LibraryDesktopButton onClick={moveToLibraryRegister} />
              </div>
              <FlexLinesWithOr />
              <div className="button-box">
                <RegisterDesktopButton label="Register with email" onClick={moveToRegister} />
              </div>
              <Delayed waitBeforeShow={500}>
                <div className="button-box">
                  <div className="text-box">
                    <div className="signin-button" onClick={moveToFirstPage}>
                      <SpriteIcon name="arrow-left" />
                      Sign In
                    </div>
                    <span>Already a member?</span>
                  </div>
                </div>
              </Delayed>
            </div>
          </Route>
          <Route exact path={map.Login}>
            <div className="left-part">
              <div className="logo">
                <LoginLogo />
              </div>
              <div className="button-box">
                <GoogleDesktopButton label="Continue with Google" />
              </div>
              <div className="button-box m-t-3vh">
                <MicrosoftDesktopButton />
              </div>
              <div className="button-box">
                <RegisterDesktopButton label="Sign in with email" onClick={moveToEmailLogin} />
              </div>
              <div className="button-box">
                <div className="text-box">
                  <span>New to Brillder?</span>
                  <div className="join-button" onClick={moveToJoin}>
                    Join Now
                    <SpriteIcon name="arrow-right" />
                  </div>
                </div>
              </div>
            </div>
          </Route>
        </Switch>
        <div className="right-part">
          <div className="container">
            <PhoneIcon />
          </div>
          <div className="bricks-container">
            <div className="inner">
              <div className="row">
                <div className="block" />
                <div className="block" />
                <div className="block" />
                <div className="block" />
              </div>
              <div className="row">
                <div className="block" />
                <div className="block" />
                <div className="block" />
              </div>
              <div className="row">
                <div className="block" />
                <div className="block" />
                <div className="block" />
                <div className="block" />
              </div>
              <div className="row">
                <div className="block" />
                <div className="block" />
                <div className="block" />
              </div>
              <div className="row">
                <div className="block" />
                <div className="block" />
              </div>
            </div>
          </div>
          <div className="icons-container">
            <img alt="" className="glasses floating1" src="/images/login/rotatedGlasses.svg" />
            <TeachIcon className="floating3" />
            <SpriteIcon name="trowel-home" className="trowel-login text-theme-orange floating2" />
          </div>
        </div>
        <TermsLink history={props.history} />
        <PolicyDialog isOpen={isPolicyOpen} close={() => setPolicyDialog(false)} />
      </div>
    </React.Suspense>
  );
};

const mapDispatch = (dispatch: any) => ({
  loginSuccess: () => dispatch(actions.loginSuccess()),
});

const connector = connect(null, mapDispatch);

export default connector(LoginDesktopPage);
