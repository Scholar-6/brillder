import React from "react";
import { isMobile } from "react-device-detect";
import Dialog from "@material-ui/core/Dialog";

import './UnauthorizedUserDialog.scss';
import SpriteIcon from "../../SpriteIcon";
import { isPhone } from "services/phone";
import { SetAuthBrickCoverId } from "localStorage/play";
import GoogleDesktopButton from "components/loginPage/desktop/GoogleDesktopButton";

interface UnauthorizedProps {
  isOpen: boolean;
  brickId: number;
  isBeforeReview?: boolean;
  history: any;
  notyet(): void;
}

const MobileTheme = React.lazy(() => import('./themes/MobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/TabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/DesktopTheme'));

const UnauthorizedUserDialogV2: React.FC<UnauthorizedProps> = (props) => {
  const [warningOpen, setWaringOpen] = React.useState(false);

  return (
    <React.Suspense fallback={<></>}>
      {isPhone() ? <MobileTheme /> : isMobile ? <TabletTheme /> : <DesktopTheme />}
      <Dialog open={props.isOpen} className="dialog-box light-blue set-user-email-dialog auth-confirm-dialog">
        <div className="title bold">
          {props.isBeforeReview
            ? <span>To save and improve your score, and start building your personal library, create an account.</span>
            : <span>Great that you've clicked a brick!<br /> A new world of learning starts here.</span>}
        </div>
        <button className="btn btn-md bg-white" onClick={() => {
          SetAuthBrickCoverId(props.brickId);
          props.history.push('/login')
        }}>
          <SpriteIcon name="f-user-check" />
          <span>I’m a member, sign in</span>
        </button>
        <GoogleDesktopButton label="Register with Google" newTab={true} />
        <button className="btn btn-md bg-orange" onClick={() => {
          SetAuthBrickCoverId(props.brickId);
          props.history.push('/login/join');
        }}>
          <SpriteIcon name="f-check-clircle" />
          <span>I’d like to register in two clicks</span>
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
      <Dialog open={warningOpen} onClose={() => setWaringOpen(false)} className="dialog-box">
        <div className="dialog-header">
          <div className="bold" style={{ textAlign: 'center' }}>
            Your score will not be saved and you will be unable to access<br/>
            the review unless you create or log in to an account.<br/>
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

export default UnauthorizedUserDialogV2;
