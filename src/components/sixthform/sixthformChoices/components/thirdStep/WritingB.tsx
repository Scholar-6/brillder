import React from "react";
import BackButtonSix from "../BackButtonSix";
import ThreeButtons from "../base/ThreeButtons";
import ProgressBarWriting from "../progressBar/ProgressBarWriting";

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

  const [animatedData, setAnimatedData] = React.useState(currentStep)
  const [animatedStep, setAnimatedStep] = React.useState(0);

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
      <ProgressBarWriting step={animatedStep} total={props.choices.length} title={animatedData.name} description={animatedData.description} />
      <ThreeButtons
        currentChoice={currentStep.choice}
        firstLabel="HARDLY<br/> AT ALL" middleLabel="A FAIR BIT" lastLabel="A LOT"
        onClick={choice => {
          if (step >= props.choices.length - 1) {
          } else {
            setAnimatedData(props.choices[step + 1]);
            setAnimatedStep(step + 1);
          }

          currentStep.choice = choice;
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

export default SixStepWriting;
