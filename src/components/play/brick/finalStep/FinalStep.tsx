import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import "./FinalStep.scss";
import { Brick } from "model/brick";
import { PlayStatus } from "../model";
import sprite from "assets/img/icons-sprite.svg";

import Clock from "../baseComponents/Clock";
import ShareDialog from './dialogs/ShareDialog';
import LinkDialog from './dialogs/LinkDialog';
import LinkCopiedDialog from './dialogs/LinkCopiedDialog';

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

  if (status === PlayStatus.Live) {
    history.push(link);
  }

  const renderFooter = () => {
    return (
      <div className="action-footer">
        <div></div>
        <div className="direction-info">
          Exit
        </div>
        <div>
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
                    <Grid container item xs={5} justify="center">
                      <div>
                        <div className="button-container">
                          <svg className="svg active" onClick={()=> setShare(true)}>
                            {/*eslint-disable-next-line*/}
                            <use href={sprite + "#share"} />
                          </svg>
                        </div>
                        <div className="link-text">Share</div>
                        <div className="link-description">with external users via</div>
                        <div className="link-description">email and social media</div>
                      </div>
                    </Grid>
                    <Grid container item xs={5} justify="center">
                      <div>
                        <div className="button-container" onClick={()=> {}}>
                          <svg className="svg active inline-button">
                            {/*eslint-disable-next-line*/}
                            <use href={sprite + "#user-plus"} />
                          </svg>
                        </div>
                        <div className="link-text">Invite</div>
                        <div className="link-description">internal users</div>
                        <div className="link-description">to play this brick</div>
                      </div>
                    </Grid>
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
                {renderFooter()}
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
          {renderFooter()}
        </div>
      </Hidden>
      <LinkDialog isOpen={linkOpen} link={document.location.host + link} submit={() => setCopiedLink(true)} close={() => setLink(false)} />
      <LinkCopiedDialog isOpen={linkCopiedOpen} close={()=> setCopiedLink(false)} />
      <ShareDialog isOpen={shareOpen} link={() => { setShare(false); setLink(true) }} close={() => setShare(false)} />
    </div>
  );
};

export default FinalStep;
