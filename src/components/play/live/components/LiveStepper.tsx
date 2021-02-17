import React from "react";

import "../Live.scss";
import { Question } from "model/question";
import PulsingCircle from './PulsingCircle';

interface StepperProps {
  activeStep: number;
  previousStep: number;
  questions: Question[];
  handleStep(questionIndex: number): any;
  moveToPrep(): void;
}

const LiveStepper: React.FC<StepperProps> = ({ questions, ...props }) => {
  let questionIndex = 0;

  const isAttempted = (question: Question) => {
    if (question.edited) {
      return true;
    }
    return false;
  }

  const renderQuestionStep = (question: Question, key: number) => {
    let edited = isAttempted(question);

    let className = "step";
    if (edited) {
      className += " completed";
    }
    if (props.activeStep === questionIndex) {
      className += " current";
    }
    questionIndex++;
    let index = questionIndex;
    return (
      <div key={key} className={className} onClick={props.handleStep(index - 1)}>
        <span>{questionIndex}</span>
        {question.edited && <PulsingCircle isPulsing={props.previousStep === questionIndex - 1} />}
      </div>
    );
  };

  return (
    <div className="stepper">
      <div className="step current prep-step" onClick={props.moveToPrep}>Prep</div>
      {questions.map(renderQuestionStep)}
    </div>
  );
};

export default LiveStepper;
