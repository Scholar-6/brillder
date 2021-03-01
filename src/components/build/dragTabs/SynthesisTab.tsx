import React from "react";
import { Grid } from "@material-ui/core";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import CommentIndicator from "../baseComponents/CommentIndicator";

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
  const isValid = props.synthesis.trim().length > 0;

  return (
    <Grid
      className={`drag-tile ${
        props.validationRequired && !isValid ? "invalid" : ""
        }`}
      container
      alignContent="center"
      justify="center"
    >
      <CommentIndicator replyType={replyType} />
      <div className={`last-tab svgOnHover ${className}`}>
        <SpriteIcon name="list-custom" className="svg w100 h100 active text-theme-dark-blue" />
      </div>
    </Grid>
  );
};

export default SynthesisTab;
