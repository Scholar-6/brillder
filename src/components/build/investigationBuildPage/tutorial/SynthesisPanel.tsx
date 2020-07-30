import React from 'react'
import { Grid, Button } from '@material-ui/core';

import './SynthesisPanel.scss';
import sprite from "assets/img/icons-sprite.svg";
import { TutorialStep } from './TutorialPanelWorkArea';


export interface TutorialProps {
  next(step: TutorialStep): void;
  skip(): void;
}

const SynthesisPanel: React.FC<TutorialProps> = (props) => {
  return (
    <div className="tutorial-synthesis-panel">
      <div className="tutorial-step-1">
        <Grid container justify="center">
          <div className="synthesis-border svgOnHover border-animation">
            <svg className="svg w60 h60 active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#list"} className="text-theme-dark-blue" />
            </svg>
          </div>
        </Grid>
        <p className="center">
          The Synthesis tab can be added to or edited at any time.
        </p>
        <div className="proposal-box">
          <h2>3. The Synthesis</h2>
          <p>This is your opportunity to showcase some authorial flair and tie what may be complex material together. The Synthesis appears to the learner after they have attempted questions independently and should help them improve their scores when reviewing the brick they have just played.</p>
        </div>
      </div>
      <Grid container direction="row" className="button-row">
        <Grid container justify="flex-start" item xs={5}>
          <div className="left-arrow" onClick={() => props.next(TutorialStep.Investigation)} />
          <span className="button-label bold">2. The Investigation</span>
        </Grid>
        <Grid container justify="center" item xs={2}>
          <Button onClick={props.skip}>SKIP</Button>
        </Grid>
        <Grid container justify="flex-end" item xs={5}>
          <span className="bold">4. Play Preview and Submission</span>
          <div className="right-arrow" onClick={() => props.next(TutorialStep.Play)} />
        </Grid>
      </Grid>
    </div>
  );
}

export default SynthesisPanel;
