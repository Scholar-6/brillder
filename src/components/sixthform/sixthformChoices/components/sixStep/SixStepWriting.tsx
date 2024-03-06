import React from "react";
import BackButtonSix from "../BackButtonSix";
import ProgressBarStep6 from "../progressBar/ProgressBarStep6";

export enum WatchingChoice {
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

const SixStepWriting: React.FC<ThirdProps> = (props) => {
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
    <div className="question question-6 question-3-watching question-5-speaking">
      <div className="bold font-32 question-text">
        <div>
          Writing
        </div>
      </div>
      <div className="font-16">
        For each type of writing, say how much of it you do.
      </div>
      <div className="font-16">How true are the following statements of you?</div>
      <img src="/images/choicesTool/ThirdStepWatching.png" className="step3watching-img-v2" />
      <ProgressBarStep6 icon="writing-sixth" step={step} total={props.choices.length} subjectDescription={currentStep.label} />
      <div className="btns-container-r32 font-20 bold flex-center">
        {renderBtn(currentStep.choice, WatchingChoice.Never, "btn-red", "HARDLY AT ALL")}
        {renderBtn(currentStep.choice, WatchingChoice.Sometimes, "btn-orange", "SORT OF")}
        {renderBtn(currentStep.choice, WatchingChoice.ALot, "btn-green", "DEFINITELY")}
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
