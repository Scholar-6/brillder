import React from "react";
import { Grid } from "@material-ui/core";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import SpriteIcon from "components/baseComponents/SpriteIcon";

export interface SynthesisTabProps {
  columns: number;
  synthesis: string;
  validationRequired: boolean;
  tutorialStep: TutorialStep;
  getHasReplied(): number;
}

const SynthesisTab: React.FC<SynthesisTabProps> = (props) => {
  let className = "synthesis-tab-icon";
  if (props.columns > 23) {
    className += " width-based";
  }
  if (props.tutorialStep === TutorialStep.Synthesis) {
    className += " editor-border svgOnHover border-animation";
  }

  const replyType = props.getHasReplied();

  return (
    <Grid
      className={`drag-tile ${
        props.validationRequired && !props.synthesis ? "invalid" : ""
        }`}
      container
      alignContent="center"
      justify="center"
    >
      {
        (replyType !== 0) &&
          <div className={"unread-indicator" + (replyType > 0 ? " has-replied" : "")}>
            <div className="outer-circle"></div>
            <div className="inner-circle"></div>
          </div>
      }
      <div className={`last-tab svgOnHover ${className}`}>
        <SpriteIcon name="list-custom" className="svg w100 h100 active text-theme-dark-blue" />
      </div>
    </Grid>
  );
};

export default SynthesisTab;
