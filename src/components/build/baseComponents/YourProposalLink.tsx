import React from 'react'

import './YourProposalLink.scss';
import sprite from "assets/img/icons-sprite.svg";
import { TutorialStep } from '../tutorial/TutorialPanelWorkArea';
import { useHistory } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { clearProposal } from 'localStorage/proposal';


export interface YourProposalButtonProps {
  brickId: number;
  invalid: boolean;
  tutorialStep: TutorialStep;
  tooltipsOn: boolean;
  setTooltips(value: boolean): void;
  saveBrick?(): void;
  isTutorialPassed(): boolean;
}

const YourProposalLink: React.FC<YourProposalButtonProps> = ({
  invalid, brickId, tooltipsOn, tutorialStep, setTooltips, saveBrick, isTutorialPassed
}) => {
  const history = useHistory();

  const editProposal = () => {
    clearProposal();
    saveBrick?.();
    history.push(`/build/brick/${brickId}/proposal`);
  }

  const renderZapTooltip = () => {
    if (!isTutorialPassed() && tutorialStep === TutorialStep.Additional) {
      let className = "additional-tooltip"
      if (tooltipsOn === false) {
        className += " tooltip-off";
      }

      return (
        <div className={className}>
          <div className="tooltip-text">Tool Tips</div>
          <button onClick={() => setTooltips(!tooltipsOn)}>
            <img
              alt="" className="additional-tooltip-icon"
              src={
                tooltipsOn === true
                  ? "/feathericons/zap-white.png"
                  : "/feathericons/zap-off-light-blue.png"
              }
            />
          </button>
        </div>
      );
    }
    return "";
  }

  let className = "proposal-container";

  if (!isTutorialPassed()) {
    if (tutorialStep === TutorialStep.Proposal) {
      className += " white proposal";
    }
  }
  
  if (invalid) {
    className += " invalid";
  }

  return (
    <div className={className}>
      <Grid container justify="center" className="your-proposal-container">
        <div onClick={editProposal} className="proposal-link">
          <div className="proposal-edit-icon svgOnHover">
            <svg className="svg w80 h80 active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#edit-outline"} />
            </svg>
          </div>
          <div className="proposal-text">
            <div style={{ lineHeight: 0.9 }}>YOUR</div>
            <div style={{ lineHeight: 2 }}>PLAN</div>
          </div>
        </div>
      </Grid>
      {renderZapTooltip()}
    </div>
  );
}

export default YourProposalLink;
