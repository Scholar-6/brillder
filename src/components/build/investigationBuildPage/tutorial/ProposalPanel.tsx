import React from 'react'
import { Grid, Button } from '@material-ui/core';
import sprite from "../../../../assets/img/icons-sprite.svg";
import './ProposalPanel.scss';
import { TutorialStep } from './TutorialPanelWorkArea';


export interface TutorialProps {
  next(step: TutorialStep): void;
  skip(): void;
}

const ProposalPanel: React.FC<TutorialProps> = (props) => {
  return (
    <div className="tutorial-proposal-panel">
      <div className="tutorial-step-1">
        <h1>There are 4 steps to the build process.</h1>
        <Grid container justify="center">
          <div className="edit-border border-animation svgOnHover">
            <svg className="svg w80 h80 active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#edit-outline"} className="text-theme-dark-blue" />
            </svg>
          </div>
        </Grid>
        <p className="center">
          You can <span className="bold">Edit Your Proposal</span> at anytime by clicking the text to the left of this window.
        </p>
        <div className="proposal-box">
          <h2>1. The Proposal</h2>
          <p>If you’ve made it here, then you’ve at least made a start on your proposal. If you are working with an editor, they will receive a notification at this point and be able to view the draft proposal of your brick.</p>
          <p className="last-text bold">The Proposal can also be accessed via your ‘Back to Work’ page.</p>
        </div>
      </div>
      <Grid container direction="row" className="button-row">
        <Grid item xs={4} />
        <Grid container justify="center" item xs={4}>
          <Button onClick={props.skip}>SKIP</Button>
        </Grid>
        <Grid container justify="flex-end" item xs={4}>
          <span className="bold">2. The Investigation</span>
          <div className="right-arrow" onClick={() => props.next(TutorialStep.Investigation)} />
        </Grid>
      </Grid>
    </div>
  );
}

export default ProposalPanel;

