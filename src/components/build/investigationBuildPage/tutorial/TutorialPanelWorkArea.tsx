import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ProposalPanel from './ProposalPanel';
import InvestigationPanel from './InvestigationPanel';
import SynthesisPanel from './SynthesisPanel';
import PlayPanel from './PlayPanel';
import AdditionalPanel from './AdditionalPanel';


export enum TutorialStep {
  None,
  Proposal,
  Investigation,
  Synthesis,
  Play,
  Additional,
}

export interface TutorialProps {}

const TutorailPanelWorkArea: React.FC<TutorialProps> = () => {
  const [step, setStep] = React.useState(TutorialStep.Proposal);

  const skip = () => {

  }

  const renderStepPanel = () => {
    console.log(step)
    if (step === TutorialStep.Proposal) {
      return <ProposalPanel next={(step) => setStep(step)} skip={skip} />
    } else if (step === TutorialStep.Investigation) {
      return <InvestigationPanel next={(step) => setStep(step)} skip={skip} />
    } else if (step === TutorialStep.Synthesis) {
      return <SynthesisPanel next={(step) => setStep(step)} skip={skip} />
    } else if (step === TutorialStep.Play) {
      return <PlayPanel next={(step) => setStep(step)} skip={skip} />
    } else if (step === TutorialStep.Additional) {
      return <AdditionalPanel next={(step) => setStep(step)} skip={skip} />
    }
    return "";
  }

  return (
    <MuiThemeProvider >
      <div className="build-question-page tutorial-panel" style={{width: '100%', height: '94%'}}>
        {renderStepPanel()}
      </div>
    </MuiThemeProvider>
  );
}

export default TutorailPanelWorkArea
