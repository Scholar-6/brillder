import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import SecondTable from "../sixStep/SecondTable";
import ProgressBarStep6 from "../progressBar/ProgressBarStep6";

interface ThirdProps {
  watchingChoices: any[];
  onChange(watchingChoices: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

const ThirdStepWatching: React.FC<ThirdProps> = (props) => {
  const [step, setStep] = React.useState(0);
  let currentStep = props.watchingChoices[step];
  console.log(currentStep);
  return (
    <div className="question question-6 question-3-watching">
      <div className="font-16 question-text">
        <div>
          How often do you watch the following?
        </div>
        <div className="hover-area font-14">
          <SpriteIcon name="help-circle-r1" className="info-icon" />
          <div className="hover-content regular">
            <div className="triangle-popup" />
            What you choose to watch reflects your interests and, to some<br />
            extent, your capacity to challenge yourself with content which might<br />
            seek to inform or educate as well as simply entertain.
          </div>
        </div>
      </div>
      <img src="/images/choicesTool/ThirdStepWatching.png" className="step3watching-img-v2" />
      <ProgressBarStep6 step={step} total={props.watchingChoices.length} subjectDescription={currentStep.label} />
      <div className="btns-container-r32 font-20 bold flex-center">
        <div className="btn btn-red">NEVER OR<br/> HARDLY EVER</div>
        <div className="btn btn-orange">SOMETIMES</div>
        <div className="btn btn-green">A LOT</div>
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
          if (step >= props.watchingChoices.length - 1) {
            props.moveNext()
          } else {
            setStep(step + 1);
          }
        }}>Continue</button>
    </div>
  );
}

export default ThirdStepWatching;
