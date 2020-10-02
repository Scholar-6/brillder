import React, { useEffect } from "react";

import './LastSave.scss'
import { Grid } from "@material-ui/core";
import { TutorialStep } from "components/build/tutorial/TutorialPanelWorkArea";


interface LastSaveProps {
  tutorialStep: TutorialStep;
  isSaving: boolean;
  updated: string;
}

const LastSave: React.FC<LastSaveProps> = (props) => {
  const updated = new Date(props.updated);
  const [isSaving, setSaving] = React.useState(props.isSaving);
  const [saveTimeout, setSaveTimeout] = React.useState(null as any);

  useEffect(() => {
    if (props.isSaving) {
      setSaving(true);
      if (saveTimeout) {
        clearInterval(saveTimeout);
      }
      let timeout = setTimeout(() => setSaving(false), 1000);
      setSaveTimeout(timeout);
    }
  }, [props, saveTimeout]);

  const formatTwoDigits = (number: Number) => {
    let str = number.toString();
    // eslint-disable-next-line
    if (str.length < 2) {
      return '0' + str;
    }
    return str;
  }

  const getTime = (updated: Date) => {
    let hours = formatTwoDigits(updated.getHours());
    let minutes = formatTwoDigits(updated.getMinutes());
    return hours + ":" + minutes;
  }

  const renderText = () => {
    if (isSaving) {
      return "Saving...";
    } else {
      return `Last Saved at ${getTime(updated)}`;
    }
  }

  const { tutorialStep } = props;
  if (tutorialStep === TutorialStep.Proposal
    || tutorialStep === TutorialStep.Investigation
    || tutorialStep === TutorialStep.Synthesis
    || tutorialStep === TutorialStep.Play
  ) {
    return <div></div>;
  }

  let className = "";
  if (tutorialStep === TutorialStep.Additional) {
    className = " editor-border";
  }

  return (
    <div className="saved-info">
      <Grid container alignContent="center" justify="center">
        <div className={className}>
          <Grid container direction="row" className="saved-info-row">
            <Grid item xs={2}>
              <Grid container alignContent="center" justify="center">
                <img alt="" src="/feathericons/svg/save-white.svg" />
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
