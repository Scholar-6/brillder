import React from "react";
import { Grid } from "@material-ui/core";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";


interface LabelProps {
  tutorialStep: TutorialStep;
  isTutorialPassed: boolean;
}

const TutorialLabels: React.FC<LabelProps> = (props) => {
  if (!props.isTutorialPassed) {
    return (
      <div className="tutorial-top-labels">
        <div className="exit-arrow">
          <img alt="" src="/images/exit-arrow.png" />
        </div>
        <Grid container direction="row" style={{ height: '100%' }}>
          <Grid container item xs={9} justify="center" style={{ height: '100%' }}>
            <Grid container item xs={9} style={{ height: '100%' }}>
              <div className="tutorial-exit-label" style={{ height: '100%' }}>
                <Grid container alignContent="center" style={{ height: '100%' }}>
                  Click the red icon to Exit & Save
                </Grid>
              </div>
              {props.tutorialStep != TutorialStep.Proposal &&
              <div className="tutorial-add-label" style={{ height: '100%' }}>
                <Grid container alignContent="center" justify="center" style={{ height: '100%' }}>
                  Add Question Panel
                </Grid>
              </div>}
              {props.tutorialStep != TutorialStep.Proposal &&
              <div className="tutorial-synthesis-label" style={{ height: '100%' }}>
                <Grid container alignContent="center" justify="center" style={{ height: '100%' }}>
                  Synthesis
                </Grid>
              </div>}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
  return <div></div>;
}

export default TutorialLabels;
