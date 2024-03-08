import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProgressBarStep6Entusiasm from "../progressBar/ProgressBarStep6Entusiasm";

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

const SixStepEntusiasm: React.FC<ThirdProps> = (props) => {
  const [step, setStep] = React.useState(0);
  let currentStep = props.choices[step];

  const renderBtn = (choice: ChoiceEnum, realChoice: ChoiceEnum, className: string, label: string) => {
    const isEmpty = choice === null;
    const isActive = choice === realChoice;
    return (
      <div
        className={`btn ${isEmpty ? 'empty' : isActive ? 'active' : "not-active"} ${className}`}
        onClick={() => {
          currentStep.choice = realChoice;
          props.onChange(props.choices);
        }}
        dangerouslySetInnerHTML={{ __html: label }}
      />
    )
  }

  return (
    <div className="question question-6 question-3-watching question-6-third">
      <div className="font-16 question-text">
        <div>
          Enthusiasms, Passions and Interests
        </div>
        <div className="hover-area font-14">
          <SpriteIcon name="help-circle-r1" className="info-icon" />
          <div className="hover-content regular">
            <div className="triangle-popup" />
            Please be assured that we NEVER give your data to companies which<br />
            might try to sell you stuff. The reason we are asking this is because<br />
            sometimes the things you love doing complement what you might study.
          </div>
        </div>
      </div>
      <img src="/images/choicesTool/Step6R19.png" className="step3watching-img-v2" />
      <ProgressBarStep6Entusiasm step={step} total={props.choices.length} description={currentStep.label} />
      <div className="btns-container-r32 font-20 bold flex-center">
        {renderBtn(currentStep.choice, ChoiceEnum.Never, "btn-red", "NOT REALLY<br/> TRUE")}
        {renderBtn(currentStep.choice, ChoiceEnum.Sometimes, "btn-orange", "QUITE TRUE")}
        {renderBtn(currentStep.choice, ChoiceEnum.ALot, "btn-green", "VERY TRUE!")}
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
        onClick={() => {
          if (step >= props.choices.length - 1) {
            props.moveNext()
          } else {
            setStep(step + 1);
          }
        }}>Continue</button>
    </div>
  );
}

export default SixStepEntusiasm;
