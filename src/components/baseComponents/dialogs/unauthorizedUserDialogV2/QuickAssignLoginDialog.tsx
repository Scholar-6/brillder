import React from "react";
import { isMobile } from "react-device-detect";
import Dialog from "@material-ui/core/Dialog";

import './UnauthorizedUserDialog.scss';
import SpriteIcon from "../../SpriteIcon";
import { isPhone } from "services/phone";
import { SetAuthBrickCash } from "localStorage/play";
import GoogleDesktopButton from "components/loginPage/desktop/GoogleDesktopButton";
import map from "components/map";

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
  close?(): void;
}

const MobileTheme = React.lazy(() => import('./themes/MobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/TabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/DesktopTheme'));

const QuickAssignLoginDialog: React.FC<UnauthorizedProps> = (props) => {
  const renderDialog = () => {
    return (
      <Dialog open={props.isOpen} className="dialog-box light-blue set-user-email-dialog auth-confirm-dialog" onClose={props.close}>
        <div className="title bigger bold">
          <span>Brick Completed!</span>
        </div>
        <div className="title">
          <span>Congratulations! Why not sign up now to<br/> make playing in the future simpler?</span>
        </div>

        <GoogleDesktopButton label="Continue with Google" newTab={true} />
        <MicrosoftDesktopButton returnUrl={props.history.location.pathname} />
        <UKlibraryButton history={props.history} />
        <FlexLinesWithOr />
        <button className="btn btn-md bg-orange" onClick={() => {
          SetAuthBrickCash(props.brick, props.competitionId);
          props.history.push(map.Login);
        }}>
          <SpriteIcon name="email" />
          <span>Continue with Email</span>
        </button>
      </Dialog>
    );
  }

  return (
    <React.Suspense fallback={<></>}>
      {isPhone() ? <MobileTheme /> : isMobile ? <TabletTheme /> : <DesktopTheme />}
      {renderDialog()}
    </React.Suspense>
  );
}

export default QuickAssignLoginDialog;
