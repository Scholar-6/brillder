import React from "react";
import { Grid, Hidden } from "@material-ui/core";
import queryString from 'query-string';

import "./FinalStep.scss";
import sprite from "assets/img/icons-sprite.svg";
import { Brick } from "model/brick";
import { PlayStatus } from "components/play/model";

import Clock from "components/play/baseComponents/Clock";
import ShareDialog from 'components/play/finalStep/dialogs/ShareDialog';
import InviteDialog from 'components/play/finalStep/dialogs/InviteDialog';
import LinkDialog from 'components/play/finalStep/dialogs/LinkDialog';
import LinkCopiedDialog from 'components/play/finalStep/dialogs/LinkCopiedDialog';
import ExitButton from "components/play/finalStep/ExitButton";
import ShareColumn from "components/play/finalStep/ShareColumn";
import InviteColumn from "components/play/finalStep/InviteColumn";

interface FinalStepProps {
  status: PlayStatus;
  brick: Brick;
  history: any;
  location: any;
}

const FinalStep: React.FC<FinalStepProps> = ({
  status,
  brick,
  history,
  location
}) => {
  const [shareOpen, setShare] = React.useState(false);
  const [inviteOpen, setInvite] = React.useState(false);
  const [linkOpen, setLink] = React.useState(false);
  const [linkCopiedOpen, setCopiedLink] = React.useState(false);

  let isPersonal = false;
  const values = queryString.parse(location.search);
  if (values.isPersonal) {
    isPersonal = true;
  }

  const link = `/play/brick/${brick.id}/intro`;

  const renderInviteColumn = () => {
    return (
      <InviteColumn
       firstLabel="internal users to play"
        secondLabel="or edit this brick"
        onClick={()=> setInvite(true)}
      />
    );
  }

  const renderActionColumns = () => {
    if (isPersonal) {
      return (
        <Grid className="share-row" container direction="row" justify="center">
          <ShareColumn onClick={() => setShare(true)} />
          {renderInviteColumn()}
        </Grid>
      );
    }
    return (
      <Grid className="share-row" container direction="row" justify="center">
        {renderInviteColumn()}
        <ShareColumn onClick={() => setShare(true)} />
      </Grid>
    );
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
                  <h2>Final step?</h2>
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
                <ExitButton onClick={() => {}} />
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
          <ExitButton onClick={() => {}} />
        </div>
      </Hidden>
      <LinkDialog
        isOpen={linkOpen} link={document.location.host + link}
        submit={() => setCopiedLink(true)} close={() => setLink(false)}
      />
      <LinkCopiedDialog isOpen={linkCopiedOpen} close={()=> setCopiedLink(false)} />
      <ShareDialog isOpen={shareOpen} link={() => { setShare(false); setLink(true) }} close={() => setShare(false)} />
      <InviteDialog canEdit={true} brick={brick} isOpen={inviteOpen} link={() => { setInvite(false); }} close={() => setInvite(false)} />
    </div>
  );
};

export default FinalStep;
