import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import "./FinalStep.scss";
import sprite from "assets/img/icons-sprite.svg";
import { Brick } from "model/brick";

import Clock from "../baseComponents/Clock";
import ShareDialog from './dialogs/ShareDialog';
import LinkDialog from './dialogs/LinkDialog';
import LinkCopiedDialog from './dialogs/LinkCopiedDialog';
import ShareColumn from "./ShareColumn";
import InviteColumn from "./InviteColumn";
import ExitButton from "./ExitButton";
import InviteDialog from "./dialogs/InviteDialog";
import InvitationSuccessDialog from "./dialogs/InvitationSuccessDialog";
import { User } from "model/user";
import { checkAdmin } from "components/services/brickService";
import map from "components/map";

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

  const link = `/play/brick/${brick.id}/intro`;

  const [inviteSuccess, setInviteSuccess] = React.useState({
    isOpen: false,
    accessGranted: false,
    name: ''
  });

  let isAdmin = checkAdmin(user.roles);
  let isEditor = false;
  try {
    isEditor = brick.editor?.id === user.id;
  } catch {}
  
  let isAuthor = false;
  try {
    isAuthor = brick.author.id === user.id;
  } catch {}

  const renderActionColumns = () => {
    if (!brick.isCore) {
      return (
        <Grid className="share-row" container direction="row" justify="center">
          <ShareColumn onClick={() => setShare(true)} />
          <InviteColumn onClick={()=> setInvite(true)} />
        </Grid>
      );
    } else {
      return (
        <Grid className="share-row" container direction="row" justify="center">
          <InviteColumn onClick={()=> setInvite(true)} />
        </Grid>
      );
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
                      <svg className="svg active">
                        {/*eslint-disable-next-line*/}
                        <use href={sprite + "#check-icon-thin"} />
                      </svg>
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
                <ExitButton onClick={() => {
                  if (isAuthor || isAdmin || isEditor) {
                    history.push(`${map.BackToWorkBuildTab}?isCore=${brick.isCore}`);
                  } else {
                    history.push(`${map.BackToWorkLearnTab}?isCore=${brick.isCore}`);
                  }
                 }} />
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
      <ShareDialog isOpen={shareOpen} link={() => { setShare(false); setLink(true) }} close={() => setShare(false)} />
    </div>
  );
};

export default FinalStep;
