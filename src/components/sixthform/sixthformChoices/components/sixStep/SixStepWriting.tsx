import React from "react";
import BackButtonSix from "../BackButtonSix";
import ProgressBarStep6V2 from "../progressBar/ProgressBarStep6V2";

export enum WatchingChoice {
  Never = 1,
  Sometimes,
  ALot
}

interface Props {
  choices: any[];
  onChange(choices: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

const SixStepWriting: React.FC<Props> = (props) => {
  const [step, setStep] = React.useState(0);
  let currentStep = props.choices[step];

  const renderBtn = (choice: WatchingChoice, realChoice: WatchingChoice, className: string, label: string) => {
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
    <div className="question question-6 question-3-watching question-6-writing">
      <div className="bold font-32 question-text">
        <div>
          Writing
        </div>
      </div>
      <div className="font-16">
        For each type of writing, say how much of it you do.
      </div>
      <img src="/images/choicesTool/Step6R18.png" className="step3watching-img-v2" />
      <ProgressBarStep6V2
        icon="writing-sixth" step={step} total={props.choices.length}
        title={currentStep.name} description={currentStep.description}
      />
      <div className="btns-container-r32 font-20 bold flex-center">
        {renderBtn(currentStep.choice, WatchingChoice.Never, "btn-red", "HARDLY<br/> AT ALL")}
        {renderBtn(currentStep.choice, WatchingChoice.Sometimes, "btn-orange", "A FAIR BIT")}
        {renderBtn(currentStep.choice, WatchingChoice.ALot, "btn-green", "A LOT")}
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

export default SixStepWriting;
