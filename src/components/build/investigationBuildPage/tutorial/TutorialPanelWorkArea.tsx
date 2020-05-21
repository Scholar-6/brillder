import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// @ts-ignore
import { connect } from "react-redux";

import axios from 'axios';
import ProposalPanel from './ProposalPanel';
import InvestigationPanel from './InvestigationPanel';
import SynthesisPanel from './SynthesisPanel';
import PlayPanel from './PlayPanel';
import AdditionalPanel from './AdditionalPanel';
import { User } from 'model/user';
import { useHistory } from 'react-router-dom';
import userActions from 'redux/actions/user';


export enum TutorialStep {
  None,
  Proposal,
  Investigation,
  Synthesis,
  Play,
  Additional,
}

export interface TutorialProps {
  user: User;
  brickId: number;
  getUser(): void;
  skipTutorial(): void;
}

const TutorialPanelWorkArea: React.FC<TutorialProps> = ({user, getUser, skipTutorial}) => {
  const [step, setStep] = React.useState(TutorialStep.Proposal);

  const skip = () => {
    skipTutorial();
  }

  const notShowAgain = () => {
    axios.put(
      `${process.env.REACT_APP_BACKEND_HOST}/user/tutorialShowed`, {}, {withCredentials: true}
    ).then(res => {
      if (res.data === 'OK') {
        getUser();
      }
    }).catch(error => {
      alert('Can`t save user profile');
    });
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

const mapState = (state: any) => {
  return {}
}

const mapDispatch = (dispatch: any) => {
  return {
    getUser: () => dispatch(userActions.getUser()),
  }
}

const connector = connect(mapState, mapDispatch);

export default connector(TutorialPanelWorkArea);
