import React, { useEffect } from "react";
import './LastSave.scss'
import { Grid } from "@material-ui/core";
import { TutorialStep } from "components/build/tutorial/TutorialPanelWorkArea";
import { getTime } from "components/services/brickService";


interface LastSaveProps {
  tutorialStep: TutorialStep;
  isSaving: boolean;
  updated: string;
}

const LastSave: React.FC<LastSaveProps> = (props) => {
  const updated = new Date(props.updated);
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
        return setTimeout(() => setSaving(false), 1000);
      });
    }
  }, [props]);

  const renderText = () => {
    if (isSaving) {
      return "Saving...";
    } else {
      return `Last Saved at ${getTime(props.updated)}`;
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
