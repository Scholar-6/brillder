import React from "react";
import BackButtonSix from "../BackButtonSix";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProgressBarStep6 from "../progressBar/ProgressBarStep6";

export enum WatchingChoice {
  Never = 1,
  Sometimes,
  ALot
}

interface ThirdProps {
  watchingChoices: any[];
  onChange(watchingChoices: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

const ThirdStepWatching: React.FC<ThirdProps> = (props) => {
  const [step, setStep] = React.useState(0);
  let currentStep = props.watchingChoices[step];

  const renderBtn = (choice: WatchingChoice, realChoice: WatchingChoice, className: string, label: string) => {
    const isEmpty = choice === null;
    const isActive = choice === realChoice;
    return (
      <div
        className={`btn ${isEmpty ? 'empty' : isActive ? 'active' : "not-active"} ${className}`}
        onClick={() => {
          currentStep.choice = realChoice;
          props.onChange(props.watchingChoices);
          console.log(step, props.watchingChoices.length - 1);
          if (step >= props.watchingChoices.length - 1) {
            console.log('move next');
            props.moveNext()
          } else {
            console.log('step + 1');
            setStep(step + 1);
          }
        }}
        dangerouslySetInnerHTML={{__html: label}}
      />
    )
  }

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
      <ProgressBarStep6 icon="watching-start" step={step} total={props.watchingChoices.length} subjectDescription={currentStep.label} />
      <div className="btns-container-r32 font-20 bold flex-center">
        {renderBtn(currentStep.choice, WatchingChoice.Never, "btn-red", "NEVER OR<br/> HARDLY EVER")}
        {renderBtn(currentStep.choice, WatchingChoice.Sometimes, "btn-orange", "SOMETIMES")}
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
        onClick={props.moveNext}>Skip</button>
    </div>
  );
}

export default ThirdStepWatching;
