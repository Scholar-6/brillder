import React from "react";
import { Grid } from "@material-ui/core";
import sprite from "assets/img/icons-sprite.svg";
import './TutorialPreview.scss';
import { TutorialStep } from './TutorialPanelWorkArea';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";


interface QuestionTypePreviewProps {
  step: number;
}

const ProposalPreview: React.FC = () => {
  return (
    <div className="tutorial-preview tutorial-proposal-preview">
      <div className="tutorial-number">1.</div>
      <Grid container justify="center">
        <div className="tutorial-icon-container svgOnHover">
          <svg className="svg w60 h60 active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#edit-outline"} className="text-theme-dark-blue" />
          </svg>
        </div>
      </Grid>
    </div>
  );
}

const InvestigationPreview: React.FC = () => {
  return (
    <div className="tutorial-preview tutorial-investigation-preview">
      <div className="tutorial-number">2.</div>
      <Grid container justify="center">
        <div className="tutorial-icon-container svgOnHover">
          <svg className="svg w80 h80 active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#plus"} className="text-theme-dark-blue" />
          </svg>
        </div>
      </Grid>
    </div>
  );
}

const SynthesisPreview: React.FC = () => {
  return (
    <div className="tutorial-preview tutorial-synthesis-preview">
      <div className="tutorial-number">3.</div>
      <Grid container justify="center">
        <div className="tutorial-icon-container svgOnHover">
          <svg className="svg w60 h60 active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#list"} className="text-theme-dark-blue" />
          </svg>
        </div>
      </Grid>
    </div>
  );
}

const PlayPreview: React.FC = () => {
  return (
    <div className="tutorial-preview tutorial-play-preview">
      <div className="tutorial-number">4.</div>
      <Grid container justify="center">
        <div className="tutorial-icon-container svgOnHover">
          <svg className="svg w80 h80 active m-l-1">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#play-thick"} className="text-theme-dark-blue" />
          </svg>
        </div>
      </Grid>
    </div>
  );
}

const AdditionalPreview: React.FC = () => {
  return (
    <div className="tutorial-preview tutorial-additional-preview">
      <div className="tutorial-number">5.</div>
      <Grid container justify="center">
        <div className="tutorial-icon-container svgOnHover">
          <svg className="svg w80 h80 active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#zap"} className="text-theme-dark-blue" />
          </svg>
        </div>
      </Grid>
    </div>
  );
}

const TutorialPhonePreview: React.FC<QuestionTypePreviewProps> = ({ step }) => {
  if (step === TutorialStep.Proposal) {
    return <PhonePreview Component={ProposalPreview} />
  } else if (step === TutorialStep.Investigation) {
    return <PhonePreview Component={InvestigationPreview} />
  } else if (step === TutorialStep.Synthesis) {
    return <PhonePreview Component={SynthesisPreview} />
  } else if (step === TutorialStep.Play) {
    return <PhonePreview Component={PlayPreview} />
  } else if (step === TutorialStep.Additional) {
    return <PhonePreview Component={AdditionalPreview} />
  }
  return <div></div>;
}

export default TutorialPhonePreview;
