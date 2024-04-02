import React from "react";
import BackButtonSix from "../BackButtonSix";
import { LinearProgress } from "@material-ui/core";
import AnimatedDescription from "../progressBar/AnimatedDescription";
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

  const [animatedData, setAnimatedData] = React.useState(currentStep)
  const [animatedStep, setAnimatedStep] = React.useState(0);

  const total = props.choices.length;
  const value = ((step + 1) / total) * 100;

  return (
    <div className="question question-6 question-3-watching question-6-third">
      <img src="/images/choicesTool/Step6R20.png" className="step3watching-img-v2" />
      <div className="progress-description-container-r3234 progress-watching-bar progress-entusiasm-bar box-bigger-r343">
        <LinearProgress className="progress-bar-long-r233" variant="determinate" value={value} />
        <div className="font-14 paging-3c1">{step + 1} / {props.choices.length} items</div>
        <div className="flex-center bold font-24">One day I’d like to...</div>
        <div className="flex-center progress-content-box-r233">
          <AnimatedDescription step={animatedStep} description={animatedData.label} textClass='bold' />
        </div>
      </div>
      <ThreeButtons
        currentChoice={currentStep.choice}
        firstLabel="NOT REALLY" middleLabel="MAYBE" lastLabel="DEFINITELY"
        onClick={realChoice => {
          currentStep.choice = realChoice;
          props.onChange(props.choices);

          if (step >= props.choices.length - 1) {
          } else {
            setAnimatedData(props.choices[step + 1]);
            setAnimatedStep(step + 1);
          }

          setTimeout(() => {
            if (step >= props.choices.length - 1) {
              props.moveNext();
            } else {
              setStep(step + 1);
            }
          }, 350);
        }} />
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

export default SixStepDreams;
