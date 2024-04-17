import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProgressBarSpeaking from "../progressBar/ProgressBarSpeaking";
import ThreeButtons from "../base/ThreeButtons";
import NextButtonSix from "../NextButtonSix";
import { isPhone } from "services/phone";

export enum WatchingChoice {
  Never = 1,
  Sometimes,
  ALot
}

interface ThirdProps {
  speakingChoices: any[];
  onChange(speakingChoices: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

const Speaking: React.FC<ThirdProps> = (props) => {
  const [step, setStep] = React.useState(0);
  let currentStep = props.speakingChoices[step];

  const [animatedData, setAnimatedData] = React.useState(currentStep)
  const [animatedStep, setAnimatedStep] = React.useState(0);

  if (isPhone()) {
    return (
      <div className="question question-6 question-reading question-3-watching question-5-speaking">
        <div className="relative">
          <img src="/images/choicesTool/FifthStepSpeaking.png" className="step3watching-img-v2" />
        </div>
        <div className="font-24 bold question-text">
          Speaking
        </div>
        <div className="font-16 margin-left-4">How true are the following<br/> statements of you?</div>
        <ProgressBarSpeaking step={animatedStep} total={props.speakingChoices.length} subjectDescription={animatedData.label} />
        <ThreeButtons
          currentChoice={currentStep.choice}
          firstLabel="NOT REALLY" middleLabel="SORT OF" lastLabel="DEFINITELY"
          onClick={realChoice => {
            if (step >= props.speakingChoices.length - 1) {
            } else {
              setAnimatedData(props.speakingChoices[step + 1]);
              setAnimatedStep(step + 1);
            }
  
            currentStep.choice = realChoice;
            props.onChange(props.speakingChoices);
  
            setTimeout(() => {
              if (step >= props.speakingChoices.length - 1) {
                props.moveNext()
              } else {
                setStep(step + 1);
              }
            }, 350);
          }}
        />
        <BackButtonSix onClick={() => {
          if (step <= 0) {
            props.moveBack();
          } else {
            setAnimatedData(props.speakingChoices[step - 1]);
            setAnimatedStep(step - 1);
            setStep(step - 1);
          }
        }} />
        <NextButtonSix label="Skip" onClick={props.moveNext} />
      </div>
    );
  }

  return (
    <div className="question question-6 question-3-watching question-5-speaking">
      <div className="font-32 bold question-text">
        Speaking
      </div>
      <div className="font-16">How true are the following statements of you?</div>
      <img src="/images/choicesTool/FifthStepSpeaking.png" className="step3watching-img-v2" />
      <ProgressBarSpeaking step={animatedStep} total={props.speakingChoices.length} subjectDescription={animatedData.label} />
      <ThreeButtons
        currentChoice={currentStep.choice}
        firstLabel="NOT REALLY" middleLabel="SORT OF" lastLabel="DEFINITELY"
        onClick={realChoice => {
          if (step >= props.speakingChoices.length - 1) {
          } else {
            setAnimatedData(props.speakingChoices[step + 1]);
            setAnimatedStep(step + 1);
          }

          currentStep.choice = realChoice;
          props.onChange(props.speakingChoices);

          setTimeout(() => {
            if (step >= props.speakingChoices.length - 1) {
              props.moveNext()
            } else {
              setStep(step + 1);
            }
          }, 350);
        }}
      />
      <BackButtonSix onClick={() => {
        if (step <= 0) {
          props.moveBack();
        } else {
          setAnimatedData(props.speakingChoices[step - 1]);
          setAnimatedStep(step - 1);
          setStep(step - 1);
        }
      }} />
      <NextButtonSix label="Skip" onClick={props.moveNext} />
    </div>
  );
}

export default Speaking;
