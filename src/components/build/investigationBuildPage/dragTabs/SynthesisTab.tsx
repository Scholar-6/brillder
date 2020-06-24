import React from "react";
import { Grid } from "@material-ui/core";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";

export interface SynthesisTabProps {
  columns: number;
  synthesis: string;
  validationRequired: boolean;
  tutorialStep: TutorialStep;
}

const SynthesisTab: React.FC<SynthesisTabProps> = (props) => {
  let className = "synthesis-tab-icon";
  if (props.columns > 23) {
    className += " width-based";
  }
  if (props.tutorialStep === TutorialStep.Synthesis) {
    className += " tutorial-border";
  }
  return (
    <Grid
      className={`drag-tile ${
        props.validationRequired && !props.synthesis ? "invalid" : ""
      }`}
      container
      alignContent="center"
      justify="center"
    >
      <div className="last-tab">
        <Grid
          container
          justify="center"
          alignContent="center"
          style={{ height: "100%" }}
        >
          <img
            alt="add-synthesis"
            src="/images/synthesis-icon.png"
            className={className}
          />
        </Grid>
      </div>
    </Grid>
  );
};

export default SynthesisTab;
