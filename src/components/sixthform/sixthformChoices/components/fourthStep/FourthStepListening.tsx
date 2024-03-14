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
  listeningChoices: any[];
  onChange(listeningChoices: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

const FourthStepListening: React.FC<ThirdProps> = (props) => {
  const [step, setStep] = React.useState(0);
  let currentStep = props.listeningChoices[step];

  return (
    <div className="question question-6 question-3-watching question-6-third">
      <div className="font-16 question-text">
        <div>
          How often do you listen to the following?
        </div>
        <div className="hover-area font-14">
          <SpriteIcon name="help-circle-r1" className="info-icon" />
          <div className="hover-content regular">
            <div className="triangle-popup" />
            The average teemager spends more than two hours per<br />
            day streaming music or podcasts, or listening to radio.
          </div>
        </div>
      </div>
      <img src="/images/choicesTool/FourthStepListening.png" className="step3watching-img-v2" />
      <ProgressBarStep6 icon="listening-sixth" step={step} total={props.listeningChoices.length} subjectDescription={currentStep.label} />
      <ThreeButtons
        currentChoice={currentStep.choice}
        firstLabel="NEVER OR<br/> HARDLY EVER" middleLabel="SOMETIMES" lastLabel="A LOT"
        onClick={realChoice => {
          currentStep.choice = realChoice;
          props.onChange(props.listeningChoices);
          if (step >= props.listeningChoices.length - 1) {
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

export default FourthStepListening;
