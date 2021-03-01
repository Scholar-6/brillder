import React, { useEffect } from "react";
import { Grid, Hidden } from "@material-ui/core";

import "./FinalStep.scss";
import { Brick } from "model/brick";

import Clock from "../baseComponents/Clock";
import ShareDialog from './dialogs/ShareDialog';
import LinkDialog from './dialogs/LinkDialog';
import LinkCopiedDialog from './dialogs/LinkCopiedDialog';
import ShareColumn from "./ShareColumn";
import ExitButton from "./ExitButton";
import InviteDialog from "./dialogs/InviteDialog";
import InvitationSuccessDialog from "./dialogs/InvitationSuccessDialog";
import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import AssignSuccessDialog from 'components/baseComponents/dialogs/AssignSuccessDialog';
import AssignFailedDialog from 'components/baseComponents/dialogs/AssignFailedDialog';

import { User } from "model/user";
import map from "components/map";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { rightKeyPressed } from "components/services/key";
import AssignBrickColumn from "./AssignBrickColumn";
import { checkTeacherOrAdmin } from "components/services/brickService";

interface FinalStepProps {
  brick: Brick;
  user: User;
  history: any;
  moveNext(): void;
}

const FinalStep: React.FC<FinalStepProps> = ({
  brick,
  user,
  history,
  moveNext,
}) => {
  const [shareOpen, setShare] = React.useState(false);  
  const [linkOpen, setLink] = React.useState(false);
  const [linkCopiedOpen, setCopiedLink] = React.useState(false);
  const [inviteOpen, setInvite] = React.useState(false);

  const [assign, setAssign] = React.useState(false);
  const [assignItems, setAssignItems] = React.useState([] as any[]);
  const [assignFailedItems, setAssignFailedItems] = React.useState([] as any[]);
  const [assignSuccess, setAssignSuccess] = React.useState(false);
  const [assignFailed, setAssignFailed] = React.useState(false);

  const [inviteSuccess, setInviteSuccess] = React.useState({
    isOpen: false,
    accessGranted: false,
    name: ''
  });

  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        moveNext();
      }
    }

    document.addEventListener("keydown", handleMove, false);

    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
    };
  });

  const link = `/play/brick/${brick.id}/intro`;

  let isAuthor = false;
  try {
    isAuthor = brick.author.id === user.id;
  } catch { }

  let canSee = false;
  try {
    canSee = checkTeacherOrAdmin(user);
  } catch { }

  const renderActionColumns = () => {
    return (
      <Grid className="share-row" container direction="row" justify="center">
        <ShareColumn onClick={() => setShare(true)} />
        <AssignBrickColumn onClick={() => setAssign(true)} />
      </Grid>
    );
  }

  return (
    <div className="brick-row-container complete-container">
      <Hidden only={['xs']}>
        <div className="brick-container final-step-page">
          <Grid container direction="row">
            <Grid item xs={8}>
              <div className="introduction-page">
                <div className="intro-header">
                  <div className="left-brick-circle">
                    <div className="round-button">
                      <SpriteIcon name="check-icon-thin" className="active" />
                    </div>
                  </div>
                  <h2>All done!</h2>
                  <p>Well done for completing “{brick.title}”!</p>
                  {renderActionColumns()}
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <div className="intro-header">
                  <Clock brickLength={brick.brickLength} />
                </div>
                <div className="intro-text-row">
                </div>
                <ExitButton onClick={moveNext} />
              </div>
            </Grid>
          </Grid>
        </div>
      </Hidden>
      <Hidden only={['sm', 'md', 'lg', 'xl']}>
        <div className="brick-container mobile-final-step-page final-step-page">
          <div className="introduction-page">
            <div className="top-icon-container">
              <div className="icon-background">
                <SpriteIcon name="star" />
              </div>
            </div>
            <p>Well done for completing</p>
            <p>“{brick.title}”!</p>
            {renderActionColumns()}
            <div className="introduction-info">
              <div className="intro-text-row"></div>
            </div>
            {/* Moved to play/phoneComponents/PhonePlayFooter.tsx 
              <ExitButton onClick={() => history.push(map.ViewAllPage)} />  */}
          </div>
        </div>
      </Hidden>
      <LinkDialog
        isOpen={linkOpen} link={document.location.host + link}
        submit={() => setCopiedLink(true)} close={() => setLink(false)}
      />
      <InviteDialog
        canEdit={true} brick={brick} isOpen={inviteOpen} hideAccess={true} isAuthor={isAuthor}
        submit={name => { setInviteSuccess({ isOpen: true, name, accessGranted: false }); }}
        close={() => setInvite(false)} />
      <InvitationSuccessDialog
        isAuthor={isAuthor}
        isOpen={inviteSuccess.isOpen} name={inviteSuccess.name} accessGranted={inviteSuccess.accessGranted}
        close={() => setInviteSuccess({ isOpen: false, name: '', accessGranted: false })} />
      <LinkCopiedDialog isOpen={linkCopiedOpen} close={() => setCopiedLink(false)} />
      <ShareDialog
        isOpen={shareOpen}
        link={() => { setShare(false); setLink(true) }}
        invite={() => { setShare(false); setInvite(true) }}
        close={() => setShare(false)}
      />
       {canSee && <div>
        <AssignPersonOrClassDialog
          isOpen={assign}
          success={(items: any[], failedItems: any[]) => {
            if (items.length > 0) {
              setAssign(false);
              setAssignItems(items);
              setAssignFailedItems(failedItems);
              setAssignSuccess(true);
            } else if (failedItems.length > 0) {
              setAssignFailedItems(failedItems);
              setAssignFailed(true);
            }
          }}
          close={() => setAssign(false)}
        />
        <AssignSuccessDialog
          isOpen={assignSuccess}
          brickTitle={brick.title}
          selectedItems={assignItems}
          close={() => {
            setAssignSuccess(false);
            if (assignFailedItems.length > 0) {
              setAssignFailed(true);
            }
          }}
        />
        <AssignFailedDialog
          isOpen={assignFailed}
          brickTitle={brick.title}
          selectedItems={assignFailedItems}
          close={() => {
            setAssignFailedItems([]);
            setAssignFailed(false);
          }}
        />
      </div>}
    </div>
  );
};

export default FinalStep;
