import React from "react";
import BackButtonSix from "../BackButtonSix";
import ProgressBarStep6V2 from "../progressBar/ProgressBarStep6V2";
import ThreeButtons from "../base/ThreeButtons";

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
      <ThreeButtons
        currentChoice={currentStep.choice}
        firstLabel="HARDLY<br/> AT ALL" middleLabel="A FAIR BIT" lastLabel="A LOT"
        onClick={choice => {
          currentStep.choice = choice;
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

export default SixStepWriting;
