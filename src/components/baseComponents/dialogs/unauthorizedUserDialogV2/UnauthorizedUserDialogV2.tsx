import React from "react";
import { isMobile } from "react-device-detect";
import Dialog from "@material-ui/core/Dialog";

import './UnauthorizedUserDialog.scss';
import SpriteIcon from "../../SpriteIcon";
import { isPhone } from "services/phone";
import { SetAuthBrickCoverId } from "localStorage/play";

interface UnauthorizedProps {
  emailInvalid: boolean | null; // null - before submit
  isOpen: boolean;
  brickId: number;
  history: any;
  notyet(): void;
}

const MobileTheme = React.lazy(() => import('./themes/MobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/TabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/DesktopTheme'));

const UnauthorizedUserDialogV2: React.FC<UnauthorizedProps> = (props) => (
  <React.Suspense fallback={<></>}>
    {isPhone() ? <MobileTheme /> : isMobile ? <TabletTheme /> : <DesktopTheme />}
    <Dialog open={props.isOpen} className="dialog-box light-blue set-user-email-dialog auth-confirm-dialog">
      <div className="title bold">Great that you've clicked a brick!<br /> A new word of learning starts here:</div>
      <button className="btn btn-md bg-white" onClick={() => {
        SetAuthBrickCoverId(props.brickId);
        props.history.push('/login')
      }}>
        <SpriteIcon name="f-user-check" />
        <span>I’m a member, sign in</span>
      </button>
      <button className="btn btn-md bg-orange" onClick={() => props.history.push('/login/join')}>
        <SpriteIcon name="f-check-clircle" />
        <span>I’d like to register in two clicks</span>
      </button>
      <button className="btn btn-md bg-blue" onClick={props.notyet}>
        <SpriteIcon name="feather-search-custom" />
        <span>Keep exploring</span>
      </button>
      <div className="small-text">
        You will be redirected to this page after making your choice
      </div>
    </Dialog>
  </React.Suspense>
);

export default UnauthorizedUserDialogV2;
