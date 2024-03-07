import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProgressBarStep6Entusiasm from "../progressBar/ProgressBarStep6Entusiasm";
import ProgressBarStep6Dreams from "../progressBar/ProgressBarStep6Dreams";

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

  const renderBtn = (choice: ChoiceEnum, realChoice: ChoiceEnum, className: string, label: string) => {
    const isEmpty = choice === null;
    const isActive = choice === realChoice;
    return (
      <div
        className={`btn ${isEmpty ? 'empty' : isActive ? 'active' : "not-active"} ${className}`}
        onClick={() => {
          currentStep.choice = realChoice;
          props.onChange(props.choices);
          if (step >= props.choices.length - 1) {
            props.moveNext()
          } else {
            setStep(step + 1);
          }
        }}
        dangerouslySetInnerHTML={{ __html: label }}
      />
    )
  }

  return (
    <div className="question question-6 question-3-watching question-6-third">
      <img src="/images/choicesTool/Step6R20.png" className="step3watching-img-v2" />
      <ProgressBarStep6Dreams step={step} total={props.choices.length} description={currentStep.label} />
      <div className="btns-container-r32 font-20 bold flex-center">
        {renderBtn(currentStep.choice, ChoiceEnum.Never, "btn-red", "NOT REALLY")}
        {renderBtn(currentStep.choice, ChoiceEnum.Sometimes, "btn-orange", "MAYBE")}
        {renderBtn(currentStep.choice, ChoiceEnum.ALot, "btn-green", "DEFINITELY")}
      </div>
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
