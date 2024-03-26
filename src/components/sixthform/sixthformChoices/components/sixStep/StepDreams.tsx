import React from "react";
import BackButtonSix from "../BackButtonSix";
import ProgressBarStep6Dreams from "../progressBar/ProgressBarStep6Dreams";
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

const SixStepDreams: React.FC<ThirdProps> = (props) => {
  const [step, setStep] = React.useState(0);
  const currentStep = props.choices[step];

  return (
    <div className="question question-6 question-3-watching question-6-third">
      <img src="/images/choicesTool/Step6R20.png" className="step3watching-img-v2" />
      <ProgressBarStep6Dreams step={step} total={props.choices.length} description={currentStep.label} />
      <ThreeButtons
        currentChoice={currentStep.choice}
        firstLabel="NOT REALLY" middleLabel="MAYBE" lastLabel="DEFINITELY"
        onClick={realChoice => {
          currentStep.choice = realChoice;
          props.onChange(props.choices);
          if (step >= props.choices.length - 1) {
            props.moveNext()
          } else {
            setStep(step + 1);
          }
        }}
      />
      <BackButtonSix onClick={() => {
        if (step <= 0) {
          props.moveBack();
        } else {
          setStep(step - 1);
        }
      }} />
      <button
        className="absolute-contunue-btn font-24"
        onClick={props.moveNext}>Skip</button>
    </div>
  );
}

export default SixStepDreams;
