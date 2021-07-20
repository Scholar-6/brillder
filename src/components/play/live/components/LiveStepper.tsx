import React from "react";

import "../Live.scss";
import { Question } from "model/question";
import PulsingCircle from './PulsingCircle';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isPhone } from "services/phone";

interface StepperProps {
  activeStep: number;
  previousStep: number;
  questions: Question[];
  handleStep(questionIndex: number): any;
  moveToPrep(): void;
}

const LiveStepper: React.FC<StepperProps> = ({ questions, ...props }) => {
  const [stepperRef] = React.useState(React.createRef() as React.RefObject<HTMLDivElement>);

  let questionIndex = 0;

  const isAttempted = (question: Question) => {
    if (question.edited) {
      return true;
    }
    return false;
  }

  const renderQuestionStep = (question: Question, key: number) => {
    let edited = isAttempted(question);
    let isActive = false;

    let className = "step";
    if (edited) {
      className += " completed";
    }
    if (props.activeStep === questionIndex) {
      isActive = true;
      className += " current";
    }
    questionIndex++;
    let index = questionIndex;
    return (
      <div key={key} className={className} onClick={props.handleStep(index - 1)}>
        <span>{questionIndex}</span>
        {question.edited && <PulsingCircle isPulsing={props.previousStep === questionIndex - 1} />}
        <div className="underline"><div/></div>
        {isActive && <div className="fixed-stepper-triangle" />}
      </div>
    );
  };

  const getStepSize = () => {
    try {
      return window.innerWidth / 25.7;
    } catch {
      return 50;
    }
  }

  const scrollBack = () => {
    try {
      if (stepperRef.current) {
        let el = stepperRef.current;
        el.scrollBy(-getStepSize(), 0);
      }
    } catch {}
  }
  
  const scrollNext = () => {
    try {
      if (stepperRef.current) {
        let el = stepperRef.current;
        el.scrollBy(getStepSize(), 0);
      }
    } catch {}
  }

  if (isPhone()) {
    return (
      <div className="stepper" ref={stepperRef}>
        {questions.map(renderQuestionStep)}
      </div>
    );
  }

  return (
    <div className="stepper" ref={stepperRef}>
      {questions.length > 19 && <div className="scroll-back-button" style={{display: 'none'}}><SpriteIcon onClick={scrollBack} name="arrow-left" /></div>}
      <div className="step current prep-step" onClick={props.moveToPrep}>Prep</div>
      {questions.map(renderQuestionStep)}
      {questions.length > 19 && <div className="scroll-next-button" style={{display: 'none'}}><SpriteIcon name="arrow-right" onClick={scrollNext} /></div>}
    </div>
  );
};

export default LiveStepper;
