import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import "./FinalStep.scss";
import sprite from "assets/img/icons-sprite.svg";
import { Brick } from "model/brick";
import { PlayStatus } from "components/play/model";

import Clock from "components/play/baseComponents/Clock";
import ShareDialog from 'components/play/finalStep/dialogs/ShareDialog';
import LinkDialog from 'components/play/finalStep/dialogs/LinkDialog';
import LinkCopiedDialog from 'components/play/finalStep/dialogs/LinkCopiedDialog';
import ExitButton from "components/play/finalStep/ExitButton";
import ShareColumn from "components/play/finalStep/ShareColumn";
import InviteColumn from "components/play/finalStep/InviteColumn";

interface FinalStepProps {
  status: PlayStatus;
  brick: Brick;
  history: any;
}

const FinalStep: React.FC<FinalStepProps> = ({
  status,
  brick,
  history,
}) => {
  const [shareOpen, setShare] = React.useState(false);
  const [linkOpen, setLink] = React.useState(false);
  const [linkCopiedOpen, setCopiedLink] = React.useState(false);

  const link = `/play/brick/${brick.id}/intro`;

  const renderFooter = () => {
    return (
      <div className="action-footer" style={{bottom: '10.5vh'}}>
        <div></div>
        <div className="direction-info">
          Exit
        </div>
        <div style={{marginLeft: 0, marginRight: '1.7vw'}}>
          <button
            type="button"
            className="play-preview svgOnHover roller-red"
            onClick={() => history.push('/play/dashboard')}
          >
            <svg className="svg w80 h80 active m-l-02">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#roller-home"} />
            </svg>
          </button>
        </div>
      </div>
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
                  <Grid className="share-row" container direction="row" justify="center">
                    <ShareColumn onClick={() => setShare(true)} />
                    <InviteColumn
                      firstLabel="internal users to play"
                      secondLabel="or edit this brick"
                      onClick={()=>{}}
                    />
                  </Grid>
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
      <LinkDialog isOpen={linkOpen} link={document.location.host + link} submit={() => setCopiedLink(true)} close={() => setLink(false)} />
      <LinkCopiedDialog isOpen={linkCopiedOpen} close={()=> setCopiedLink(false)} />
      <ShareDialog isOpen={shareOpen} link={() => { setShare(false); setLink(true) }} close={() => setShare(false)} />
    </div>
  );
};

export default FinalStep;
