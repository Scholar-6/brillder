import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import Dialog from "@material-ui/core/Dialog";
import queryString from 'query-string';

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
import { LibraryLoginPage } from "components/loginPage/desktop/routes";

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

const UnauthorizedUserDialogV2: React.FC<UnauthorizedProps> = (props) => {
  const [onlyLibrary, setOnlyLibrary] = useState(false);

  const [warningOpen, setWaringOpen] = useState(false);

  useEffect(() => {
    const values = queryString.parse(location.search);
    if (values.origin === 'library') {
      setOnlyLibrary(true);
    }
  }, []);

  const renderDialog = () => {
    if (onlyLibrary) {
      return (
        <Dialog open={props.isOpen} className="dialog-box light-blue set-user-email-dialog auth-confirm-dialog auth-library-confirm-dialog">
          {isPhone() ? <MobileTheme /> : isMobile ? <TabletTheme /> : <DesktopTheme />}
          <div className="title bigger bold head-title">
            <span>Welcome to Brillder for libraries</span>
          </div>
          <div className="padding-1-2">
            <div className="title text-left">
              <span>Great that you've clicked a brick! To play for free, please connect to your library.</span>
              <div className="ll-help-container">
                <div className="hover-area-content">
                  <div className="hover-area flex-center">
                    <SpriteIcon name="help-circle-custom" />
                    <div className="hover-content bold">
                      Requires a library card barcode and pin from a participating library
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="l-label">
              <span>New to Brillder?</span>
            </div>
            <UKlibraryButton
              label="Sign Up"
              brick={props.brick}
              hideHelp={true}
              competitionId={props.competitionId}
              history={props.history}
              popupLabel="Requires a library card barcode and pin from a participating library"
            />
            <div className="l-label">
              <span>Already a user?</span>
            </div>
            <UKlibraryButton
              label="Log In"
              brick={props.brick}
              hideHelp={true}
              competitionId={props.competitionId}
              history={props.history}
              onClick={() => {
                if (props.brick) {
                  SetAuthBrickCash(props.brick, props.competitionId ? props.competitionId : -1);
                }
                props.history.push(LibraryLoginPage);
              }}
              popupLabel="Requires a library card barcode and pin from a participating library"
            />
            <div className="small-text library-small-text">
              You will be redirected to the start of the Brick after selecting an option
            </div>
            <div className="btn-library-continue" onClick={() => {
              if (onlyLibrary) {
                props.notyet()
              } else if (props.isBeforeReview) {
                setWaringOpen(true);
              } else {
                props.notyet();
              }
            }}>
              <SpriteIcon name="cancel-custom" />
              <span>Stay on page</span>
            </div>
          </div>
        </Dialog>
      )
    }

    return (
      <Dialog open={props.isOpen} className="dialog-box light-blue set-user-email-dialog auth-confirm-dialog" onClose={props.close}>
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
        <UKlibraryButton history={props.history} />
        <FlexLinesWithOr />
        <button className="btn btn-md bg-orange" onClick={() => {
          SetAuthBrickCash(props.brick, props.competitionId);
          props.history.push(map.Login);
        }}>
          <SpriteIcon name="email" />
          <span>Continue with Email</span>
        </button>
        {!props.isBeforeReview &&
          <button className="btn btn-md bg-blue" onClick={() => {
            if (props.isBeforeReview) {
              setWaringOpen(true);
            } else {
              props.notyet();
            }
          }}>
            <SpriteIcon name="feather-search-custom" />
            <span>Keep exploring</span>
          </button>}
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

export default UnauthorizedUserDialogV2;
