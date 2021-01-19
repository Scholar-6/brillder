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
import { User } from "model/user";
import { checkAdmin } from "components/services/brickService";
import map from "components/map";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { rightKeyPressed } from "components/services/key";

interface FinalStepProps {
  brick: Brick;
  history: any;
  user: User;
}

const FinalStep: React.FC<FinalStepProps> = ({
  brick,
  user,
  history,
}) => {
  const [shareOpen, setShare] = React.useState(false);
  const [linkOpen, setLink] = React.useState(false);
  const [linkCopiedOpen, setCopiedLink] = React.useState(false);
  const [inviteOpen, setInvite] = React.useState(false);

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

  let isAdmin = checkAdmin(user.roles);
  let isEditor = false;
  try {
    isEditor = (brick.editors?.findIndex(e => e.id === user.id) ?? -1) >= 0;
  } catch {}
  
  let isAuthor = false;
  try {
    isAuthor = brick.author.id === user.id;
  } catch {}

  const renderActionColumns = () => {
    return (
      <Grid className="share-row" container direction="row" justify="center">
        <ShareColumn onClick={() => setShare(true)} />
      </Grid>
    );
  }

  const moveNext = () => {
    if (isAuthor || isAdmin || isEditor) {
      history.push(`${map.ViewAllPage}?isCore=${brick.isCore}`);
    } else {
      history.push(`${map.ViewAllPage}?isCore=${brick.isCore}`);
    }
  }

  return (
    <div>
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
          <div className="introduction-info">
            <div className="intro-text-row"></div>
          </div>
          <div className="introduction-page">
          </div>
          <ExitButton onClick={() => history.push(map.ViewAllPage)} />
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
      <LinkCopiedDialog isOpen={linkCopiedOpen} close={()=> setCopiedLink(false)} />
      <ShareDialog
        isOpen={shareOpen}
        link={() => { setShare(false); setLink(true) }}
        invite={() => { setShare(false); setInvite(true)}}
        close={() => setShare(false)}
      />
    </div>
  );
};

export default FinalStep;
