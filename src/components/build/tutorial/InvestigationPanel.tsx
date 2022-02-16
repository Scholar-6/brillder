import React from 'react'
import { Grid, Button } from '@material-ui/core';
import './InvestigationPanel.scss';
import { TutorialStep } from './TutorialPanelWorkArea';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


export interface TutorialProps {
  next(step: TutorialStep): void;
  skip(): void;
}

const InvestigationPanel: React.FC<TutorialProps> = (props) => {
  return (
    <div className="tutorial-panel tutorial-investigation-panel">
      <div className="tutorial-step-1">
        <Grid container justify="center">
          <div className="editor-border ">
            <SpriteIcon name="dashed-circle" className="circle-border" />
            <SpriteIcon name="plus" className="w100 h100 active text-theme-dark-blue" />
          </div>
        </Grid>
        <p className="center">
          New Question Panels can be added by clicking the ‘<span className="bold">+</span>’ tab.
        </p>
        <div className="proposal-box">
          <h2>2. The Investigation</h2>
          <p>
            Having submitted the brief and prep in your proposal, your questions will guide learners through an interactive journey.
          </p>
          <p className="last-text">
            The challenge is to ask questions which make learners think, not questions which merely test their knowledge.
          </p>
        </div>
      </div>
      <Grid container direction="row" className="button-row">
        <Grid container justify="flex-start" className="hover-move-right" item xs={4}>
          <div className="left-arrow" onClick={() => props.next(TutorialStep.Proposal)} />
          <span className="button-label bold">1. The Plan</span>
        </Grid>
        <Grid container justify="center" item xs={4}>
          <Button onClick={props.skip}>SKIP</Button>
        </Grid>
        <Grid
          container justify="flex-end" item xs={4}
          className="hover-move-left"
          onClick={() => props.next(TutorialStep.Synthesis)}
        >
          <span className="bold">3. The Synthesis</span>
          <div className="right-arrow" />
        </Grid>
      </Grid>
    </div>
  );
}

export default InvestigationPanel;
