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
  saveBrick?(): void;
  isTutorialPassed(): boolean;
}

const YourProposalLink: React.FC<YourProposalButtonProps> = ({
  invalid, brickId, tutorialStep, saveBrick, isTutorialPassed
}) => {
  const history = useHistory();

  const editProposal = () => {
    clearProposal();
    saveBrick?.();
    history.push(`/build/brick/${brickId}/plan`);
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
    </div>
  );
}

export default YourProposalLink;
