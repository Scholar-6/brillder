import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from "react-redux";

import ProposalPanel from './ProposalPanel';
import InvestigationPanel from './InvestigationPanel';
import SynthesisPanel from './SynthesisPanel';
import PlayPanel from './PlayPanel';
import { User } from 'model/user';
import userActions from 'redux/actions/user';


export enum TutorialStep {
  None,
  Proposal,
  Investigation,
  Synthesis,
  Play,
}

export interface TutorialProps {
  user: User;
  brickId: number;
  step: TutorialStep;
  setStep(step: TutorialStep): void;
  getUser(): void;
  skipTutorial(): void;
}

const TutorialPanelWorkArea: React.FC<TutorialProps> = ({ user, step, setStep, getUser, skipTutorial }) => {
  const skip = () => skipTutorial();

  const renderStepPanel = () => {
    if (step === TutorialStep.Proposal) {
      return <ProposalPanel next={(step) => setStep(step)} skip={skip} />
    } else if (step === TutorialStep.Investigation) {
      return <InvestigationPanel next={(step) => setStep(step)} skip={skip} />
    } else if (step === TutorialStep.Synthesis) {
      return <SynthesisPanel next={(step) => setStep(step)} skip={skip} />
    } else if (step === TutorialStep.Play) {
      return <PlayPanel next={(step) => setStep(step)} skip={skip} />
    }
    return "";
  }

  return (
    <MuiThemeProvider >
      <div className="build-question-page" style={{ width: '100%', height: '94%' }}>
        {renderStepPanel()}
      </div>
    </MuiThemeProvider>
  );
}

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

const connector = connect(null, mapDispatch);

export default connector(TutorialPanelWorkArea);
