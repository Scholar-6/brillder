import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProgressBarStep6 from "../progressBar/ProgressBarStep6";
import ThreeButtons from "../base/ThreeButtons";
import { isPhone } from "services/phone";
import NextButtonSix from "../NextButtonSix";

export enum WatchingChoice {
  Never = 1,
  Sometimes,
  ALot
}

interface ThirdProps {
  watchingChoices: any[];
  onChange(watchingChoices: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

const ThirdStepWatching: React.FC<ThirdProps> = (props) => {
  const { watchingChoices } = props;
  const [step, setStep] = React.useState(0);
  let currentStep = watchingChoices[step];

  const [animatedData, setAnimatedData] = React.useState(currentStep)
  const [animatedStep, setAnimatedStep] = React.useState(0);

  if (isPhone()) {
    return (
      <div className="question question-6 quesiton-reading question-3-watching question-just-watching">
        <div className="relative">
          <img src="/images/choicesTool/phone/Watching.png" className="step3watching-img-v2" />
        </div>
        <div className="bold font-24 question-title-44 margin-left-4">TV, Video & Social<br/> Media</div>
        <div className="font-16 question-text ">
          How often do you watch<br/>
          programmes or videos on the<br/>
          following topics?
        </div>
        <ProgressBarStep6 icon="watching-start" step={animatedStep} total={watchingChoices.length} subjectDescription={animatedData.label} isBig={false} />
        <ThreeButtons
          currentChoice={currentStep.choice}
          firstLabel="RARELY" middleLabel="SOMETIMES" lastLabel="OFTEN"
          onClick={realChoice => {
            if (step >= watchingChoices.length - 1) {
            } else {
              setAnimatedData(watchingChoices[step + 1]);
              setAnimatedStep(step + 1);
            }
  
            currentStep.choice = realChoice;
            props.onChange(watchingChoices);
  
            setTimeout(() => {
              if (step >= watchingChoices.length - 1) {
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
            setAnimatedData(watchingChoices[step - 1]);
            setAnimatedStep(step - 1);
            setStep(step - 1);
          }
        }} />
        <NextButtonSix label="Skip" onClick={props.moveNext} />
      </div>
    );
  }

  return (
    <div className="question question-6 question-3-watching">
      <div className="bold font-32 question-title-44">TV, Video & Social Media</div>
      <div className="font-16 question-text">
        How often do you watch programmes or videos on the following topics?
      </div>
      <img src="/images/choicesTool/ThirdStepWatching.png" className="step3watching-img-v2" />
      <ProgressBarStep6 icon="watching-start" step={animatedStep} total={watchingChoices.length} subjectDescription={animatedData.label} isBig={false} />
      <ThreeButtons
        currentChoice={currentStep.choice}
        firstLabel="RARELY" middleLabel="SOMETIMES" lastLabel="OFTEN"
        onClick={realChoice => {
          if (step >= watchingChoices.length - 1) {
          } else {
            setAnimatedData(watchingChoices[step + 1]);
            setAnimatedStep(step + 1);
          }

          currentStep.choice = realChoice;
          props.onChange(watchingChoices);

          setTimeout(() => {
            if (step >= watchingChoices.length - 1) {
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
          setAnimatedData(watchingChoices[step - 1]);
          setAnimatedStep(step - 1);
          setStep(step - 1);
        }
      }} />
      <NextButtonSix label="Skip" onClick={props.moveNext} />
    </div>
  );
}

export default ThirdStepWatching;
