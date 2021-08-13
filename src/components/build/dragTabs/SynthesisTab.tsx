import React from "react";
import { Grid } from "@material-ui/core";
import { TutorialStep } from "../tutorial/TutorialPanelWorkArea";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import CommentIndicator from "../baseComponents/CommentIndicator";
import { stripHtml } from "../questionService/ConvertService";

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
    className += " editor-border border-animation";
  }

  const replyType = props.getHasReplied();

  return (
    <Grid
      className={`drag-tile ${props.validationRequired && !stripHtml(props.synthesis) ? "invalid" : ""}`}
      container
      alignContent="center"
      justify="center"
    >
      <CommentIndicator replyType={replyType} />
      <div className={`last-tab svgOnHover ${className}`}>
        {props.tutorialStep === TutorialStep.Synthesis && <SpriteIcon name="dashed-circle" className="circle-border" />}
        <SpriteIcon name="feather-menu" className={`svg ${props.tutorialStep === TutorialStep.Synthesis ? "w80 h80" : "w100 h100"} active icon text-theme-dark-blue`} />
        <div className="css-custom-tooltip">Synthesis</div>
      </div>
    </Grid>
  );
};

export default SynthesisTab;
