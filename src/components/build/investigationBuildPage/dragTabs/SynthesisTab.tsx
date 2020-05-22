import React from 'react'
import { Grid } from '@material-ui/core';
import { TutorialStep } from '../tutorial/TutorialPanelWorkArea';


export interface SynthesisTabProps {
  columns: number;
  synthesis: string;
  isSynthesis: boolean;
  tutorialStep: TutorialStep;
}

const SynthesisTab: React.FC<SynthesisTabProps> = ({columns, tutorialStep, synthesis, isSynthesis}) => {
  let className = 'synthesis-tab-icon';
  if (columns > 23) {
    className +=' width-based';
  }
  if (tutorialStep === TutorialStep.Synthesis) {
    className += " tutorial-border";
  }
  return (
    <div className="last-tab">
      <Grid container justify="center" alignContent="center" style={{height: '100%'}}>
        <img alt="add-synthesis" src="/images/synthesis-icon.png" className={className} />
      </Grid>
    </div>
  );
}

export default SynthesisTab
