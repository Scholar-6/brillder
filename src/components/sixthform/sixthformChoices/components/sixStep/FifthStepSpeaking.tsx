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
  speakingChoices: any[];
  onChange(speakingChoices: any[]): void;
  moveBack(): void;
  moveNext(): void;
}

const FiftthStepSpeaking: React.FC<ThirdProps> = (props) => {
  const [step, setStep] = React.useState(0);
  let currentStep = props.speakingChoices[step];

  const renderBtn = (choice: WatchingChoice, realChoice: WatchingChoice, className: string, label: string) => {
    const isEmpty = choice === null;
    const isActive = choice === realChoice;
    return (
      <div
        className={`btn ${isEmpty ? 'empty' : isActive ? 'active' : "not-active"} ${className}`}
        onClick={() => {
          currentStep.choice = realChoice;
          props.onChange(props.speakingChoices);
          if (step >= props.speakingChoices.length - 1) {
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
    <div className="question question-6 question-3-watching question-5-speaking">
      <div className="font-16 question-text">
        <div className="font-32 bold">
          Speaking?
        </div>
        <div className="hover-area font-14">
          <SpriteIcon name="help-circle-r1" className="info-icon" />
          <div className="hover-content regular">
            <div className="triangle-popup" />
            We talk about what we’re interested in, and the way we engage in<br />
            discussion and take opportunities to speak reflects our character.
          </div>
        </div>
      </div>
      <div className="font-16">How true are the following statements of you?</div>
      <img src="/images/choicesTool/ThirdStepWatching.png" className="step3watching-img-v2" />
      <ProgressBarStep6 step={step} total={props.speakingChoices.length} subjectDescription={currentStep.label} />
      <div className="btns-container-r32 font-20 bold flex-center">
        {renderBtn(currentStep.choice, WatchingChoice.Never, "btn-red", "NOT REALLY")}
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
        onClick={props.moveNext}>Skip</button>
    </div>
  );
}

export default FiftthStepSpeaking;
