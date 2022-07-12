import React from "react";
import { isMobile } from "react-device-detect";
import Dialog from "@material-ui/core/Dialog";
import { connect } from 'react-redux';

import './UnauthorizedUserDialog.scss';
import SpriteIcon from "../../SpriteIcon";
import { isPhone } from "services/phone";
import { SetAuthBrickCash } from "localStorage/play";
import GoogleDesktopButton from "components/loginPage/desktop/GoogleDesktopButton";
import RegisterDesktopButton from "components/loginPage/desktop/RegisterDesktopButton";
import map from "components/map";
import SignUpComponent from "./SignUpComponent";

import userActions from 'redux/actions/user';
import { Brick } from "model/brick";
import MicrosoftDesktopButton from "components/loginPage/desktop/MicrosoftDesktopButton";
import UKlibraryButton from "components/loginPage/components/UKLibraryButton";
import FlexLinesWithOr from "components/baseComponents/FlexLinesWithOr/FlexLinesWithOr";

interface UnauthorizedProps {
  isOpen: boolean;
  brick: Brick;
  isBeforeReview?: boolean;
  competitionId: number;
  history: any;
  notyet(): void;
  registered?(): void;

  getUser(): Promise<void>;
}

const MobileTheme = React.lazy(() => import('./themes/MobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/TabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/DesktopTheme'));

const UnauthorizedUserDialogV2: React.FC<UnauthorizedProps> = (props) => {
  const [warningOpen, setWaringOpen] = React.useState(false);

  const [registerClicked, setRegister] = React.useState(false);
  const [registerWithEmailClicked, setRegisterEmail] = React.useState(false);

  const renderDialog = () => {
    if (registerClicked) {
      if (registerWithEmailClicked) {
        return (
          <Dialog open={props.isOpen} className="dialog-box light-blue set-user-email-dialog auth-confirm-dialog">
            <SignUpComponent success={async () => {
              console.log('success')
              await props.getUser();
              props.registered?.();
            }} />
            <div className="back-button-de" onClick={() => {
              setRegisterEmail(false);
              setRegister(false);
            }}>
              <SpriteIcon name="arrow-left" />
              Back
            </div>
          </Dialog>
        )
      }
      return (
        <Dialog open={props.isOpen} className="dialog-box light-blue set-user-email-dialog auth-confirm-dialog">
          <div className="title bold">
            {props.isBeforeReview
              ? <span>To save and improve your score, and start building your personal library, create an account.</span>
              : <span>Great that you've clicked a brick!<br /> A new world of learning starts here.</span>}
          </div>
          <GoogleDesktopButton label="Register with Google" newTab={true} />
          <MicrosoftDesktopButton returnUrl={props.history.location.pathname} />
          <RegisterDesktopButton label="Register with email" onClick={() => setRegisterEmail(true)} />
          <div className="back-button-de" onClick={() => setRegister(false)}>
            <SpriteIcon name="arrow-left" />
            Back
          </div>
          <div className="small-text">
            You will be redirected to this page after making your choice
          </div>
        </Dialog>
      )
    }
    return (
      <Dialog open={props.isOpen} className="dialog-box light-blue set-user-email-dialog auth-confirm-dialog">
        <div className="title bigger bold">
          <span>Sign In or Create Account</span>
        </div>
        <div className="title">
          {props.isBeforeReview
            ? <span>To save and improve your score, and start building your personal library, create an account.</span>
            : <span>Great that you've clicked a brick!<br /> A new world of learning starts here.</span>}
        </div>

        <GoogleDesktopButton label="Continue with Google" newTab={true} />
        <MicrosoftDesktopButton returnUrl={props.history.location.pathname} />
        <UKlibraryButton onClick={() => { }} />
        <FlexLinesWithOr />
        <button className="btn btn-md bg-orange" onClick={() => {
          SetAuthBrickCash(props.brick, props.competitionId);
          props.history.push(map.Login);
        }}>
          <SpriteIcon name="email" />
          <span>Continue with Email</span>
        </button>
        <button className="btn btn-md bg-blue" onClick={() => {
          if (props.isBeforeReview) {
            setWaringOpen(true);
          } else {
            props.notyet();
          }
        }}>
          <SpriteIcon name="feather-search-custom" />
          <span>Keep exploring</span>
        </button>
        <div className="small-text">
          You will be redirected to this page after making your choice
        </div>
      </Dialog>
    )
  }

  return (
    <React.Suspense fallback={<></>}>
      {isPhone() ? <MobileTheme /> : isMobile ? <TabletTheme /> : <DesktopTheme />}
      {renderDialog()}
      <Dialog open={warningOpen} onClose={() => setWaringOpen(false)} className="dialog-box">
        <div className="dialog-header">
          <div className="bold" style={{ textAlign: 'center' }}>
            Your score will not be saved and you will be unable to access<br />
            the review unless you create or log in to an account.<br />
            Are you OK with that?
          </div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button" onClick={props.notyet}>
            <span>Yes</span>
          </button>
          <button className="btn btn-md bg-gray no-button" onClick={() => setWaringOpen(false)}>
            <span>No</span>
          </button>
        </div>
      </Dialog>
    </React.Suspense>
  );
}

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(null, mapDispatch)(UnauthorizedUserDialogV2);
