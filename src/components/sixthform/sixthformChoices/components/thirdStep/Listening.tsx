import React from "react";
import BackButtonSix from "../BackButtonSix";
import ProgressBarStep6 from "../progressBar/ProgressBarStep6";
import ThreeButtons from "../base/ThreeButtons";
import NextButtonSix from "../NextButtonSix";
import { isPhone } from "services/phone";

export enum WatchingChoice {
  Never = 1,
  Sometimes,
  ALot
}

interface ThirdProps {
  listeningChoices: any[];
  onChange(listeningChoices: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

const Listening: React.FC<ThirdProps> = (props) => {
  const [step, setStep] = React.useState(0);
  let currentStep = props.listeningChoices[step];

  const [animatedData, setAnimatedData] = React.useState(currentStep)
  const [animatedStep, setAnimatedStep] = React.useState(0);

  if (isPhone()) {
    return (
      <div className="question question-6 question-reading question-3-watching question-6-third question-listening-r545">
        <div className="relative">
          <img src="/images/choicesTool/FourthStepListening.png" className="step3watching-img-v2" />
        </div>
        <div className="font-24 bold question-title-44 margin-left-4">Listening</div>
        <div className="font-16 question-text">
          How often do you listen to the<br/>
          following kinds of programme or podcast?
        </div>
        <ProgressBarStep6 icon="listening-sixth" step={animatedStep} total={props.listeningChoices.length} subjectDescription={animatedData.label} isBig={false} />
        <ThreeButtons
          currentChoice={currentStep.choice}
          firstLabel="RARELY" middleLabel="SOMETIMES" lastLabel="OFTEN"
          onClick={realChoice => {
            if (step >= props.listeningChoices.length - 1) {
            } else {
              setAnimatedData(props.listeningChoices[step + 1]);
              setAnimatedStep(step + 1);
            }
  
            currentStep.choice = realChoice;
            props.onChange(props.listeningChoices);
  
            setTimeout(() => {
              if (step >= props.listeningChoices.length - 1) {
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
            setAnimatedData(props.listeningChoices[step - 1]);
            setAnimatedStep(step - 1);
            setStep(step - 1);
          }
        }} />
        <NextButtonSix label="Skip" onClick={props.moveNext} />
      </div>
    );
  }

  return (
    <div className="question question-6 question-3-watching question-6-third question-listening-r545">
      <div className="font-32 bold question-title-44">Listening</div>
      <div className="font-16 question-text">
        How often do you listen to the following kinds of programme or podcast?
      </div>
      <img src="/images/choicesTool/FourthStepListening.png" className="step3watching-img-v2" />
      <ProgressBarStep6 icon="listening-sixth" step={animatedStep} total={props.listeningChoices.length} subjectDescription={animatedData.label} isBig={false} />
      <ThreeButtons
        currentChoice={currentStep.choice}
        firstLabel="RARELY" middleLabel="SOMETIMES" lastLabel="OFTEN"
        onClick={realChoice => {
          if (step >= props.listeningChoices.length - 1) {
          } else {
            setAnimatedData(props.listeningChoices[step + 1]);
            setAnimatedStep(step + 1);
          }

          currentStep.choice = realChoice;
          props.onChange(props.listeningChoices);

          setTimeout(() => {
            if (step >= props.listeningChoices.length - 1) {
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
          setAnimatedData(props.listeningChoices[step - 1]);
          setAnimatedStep(step - 1);
          setStep(step - 1);
        }
      }} />
      <NextButtonSix label="Skip" onClick={props.moveNext} />
    </div>
  );
}

export default Listening;
