import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProgressBarStep6 from "../progressBar/ProgressBarStep6";
import ThreeButtons from "../base/ThreeButtons";

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
      <button
        className="absolute-contunue-btn font-24"
        onClick={props.moveNext}>Skip</button>
    </div>
  );
}

export default ThirdStepWatching;
