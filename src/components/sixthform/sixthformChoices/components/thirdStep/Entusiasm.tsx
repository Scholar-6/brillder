import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProgressBarStep6Entusiasm from "../progressBar/ProgressBarStep6Entusiasm";
import ThreeButtons from "../base/ThreeButtons";

export enum ChoiceEnum {
  Never = 1,
  Sometimes,
  ALot
}

interface ThirdProps {
  choices: any[];
  onChange(choices: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

const Entusiasm: React.FC<ThirdProps> = (props) => {
  const [step, setStep] = React.useState(0);
  let currentStep = props.choices[step];

  const [animatedData, setAnimatedData] = React.useState(currentStep)
  const [animatedStep, setAnimatedStep] = React.useState(0);

  return (
    <div className="question question-6 question-3-watching">
      <div className="font-32 bold question-title-44">
        Enthusiasms, Passions and Interests
      </div>
      <div className="font-16 question-text">
        How true are the following statements of you?
      </div>
      <img src="/images/choicesTool/Step6R19.png" className="step3watching-img-v2" />
      <ProgressBarStep6Entusiasm step={animatedStep} total={props.choices.length} description={animatedData.label} />
      <ThreeButtons
        currentChoice={currentStep.choice}
        firstLabel="NOT REALLY<br/> TRUE"
        middleLabel="QUITE TRUE"
        lastLabel="VERY TRUE!"
        onClick={realChoice => {
          if (step >= props.choices.length - 1) {
          } else {
            setAnimatedData(props.choices[step + 1]);
            setAnimatedStep(step + 1);
          }

          currentStep.choice = realChoice;
          props.onChange(props.choices);
          setTimeout(() => {
            if (step >= props.choices.length - 1) {
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
          setAnimatedData(props.choices[step - 1]);
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

export default Entusiasm;
