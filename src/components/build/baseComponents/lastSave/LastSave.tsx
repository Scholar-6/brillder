import React, { useEffect } from "react";
import './LastSave.scss'
import { Grid } from "@material-ui/core";
import { TutorialStep } from "components/build/tutorial/TutorialPanelWorkArea";
import { getTime, getFormattedDate } from "components/services/brickService";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface LastSaveProps {
  tutorialStep?: TutorialStep;
  isEditor: boolean;
  isSaving: boolean;
  saveError: boolean;
  updated: string;
}

const LastSave: React.FC<LastSaveProps> = (props) => {
  const [isSaving, setSaving] = React.useState(props.isSaving);
  // eslint-disable-next-line
  const [saveTimeout, setSaveTimeout] = React.useState(null as any);

  useEffect(() => {
    if (props.isSaving) {
      setSaving(true);
      setSaveTimeout((saveTimeout: any) => {
        if (saveTimeout) {
          clearInterval(saveTimeout);
        }
        //return setTimeout(() => setSaving(false), 1000);
      });
    } else {
      setSaving(false);
    }
  }, [props]);

  const renderText = () => {
    if (isSaving && !props.isEditor) {
      if(props.saveError) {
        return "Connection lost.";
      } else {
        return "Saving...";
      }
    } else {
      return `Last Saved at ${getTime(props.updated)} on ${getFormattedDate(props.updated)}`;
    }
  }

  const { tutorialStep } = props;
  if (tutorialStep === TutorialStep.Proposal
    || tutorialStep === TutorialStep.Investigation
    || tutorialStep === TutorialStep.Synthesis
  ) {
    return <div></div>;
  }

  let className = "";
  if (tutorialStep === TutorialStep.Play) {
    className = " editor-border";
  }

  return (
    <div className="saved-info">
      <Grid container alignContent="center" justify="center">
        <div className={className}>
          <Grid container direction="row" className={`saved-info-row ${props.saveError ? "save-error" : ""}`}>
            <Grid item xs={2}>
              <Grid container alignContent="center" justify="center">
                <SpriteIcon name={ props.saveError ? "alert-triangle": "save-icon" } className="active"/>
              </Grid>
            </Grid>
            <Grid item xs={10} container alignContent="center">
              <div className="text-container">
                {renderText()}
              </div>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </div>
  );
}

export default LastSave;
