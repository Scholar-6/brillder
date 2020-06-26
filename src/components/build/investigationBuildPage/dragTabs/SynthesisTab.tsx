import React from "react";
import { Grid } from "@material-ui/core";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import sprite from "../../../../assets/img/icons-sprite.svg";

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
      <div className="last-tab svgOnHover">
				<svg className="svg w100 h100 active">
					<use href={sprite + "#list"} className="text-theme-dark-blue" />
				</svg>
      </div>
    </Grid>
  );
};

export default SynthesisTab;
