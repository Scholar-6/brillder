import React from "react";

import "./Live.scss";
import { Question } from "model/question";
import PulsingCircle from './PulsingCircle';

interface StepperProps {
  activeStep: number;
  previousStep: number;
  questions: Question[];
  handleStep(questionIndex: number): any;
}

const LiveStepper: React.FC<StepperProps> = ({
  activeStep,
  previousStep,
  questions,
  handleStep,
}) => {
  function isAttempted(question: Question) {
    if (question.edited) {
      return true;
    }
    return false;
  }

  let colWidth = 4;
  if (questions.length > 27) {
    colWidth = 3;
  }

  let questionIndex = 0;

  const renderQuestionStep = (question: Question, key: number, colWidth: number) => {
    let edited = isAttempted(question);

    let className = "step";
    if (edited) {
      className += " completed";
    }
    if (activeStep === questionIndex) {
      className += " current";
    }
    questionIndex++;
    let index = questionIndex;
    return (
      <div  key={key} className={className} onClick={handleStep(index - 1)}>
        <span>{questionIndex}</span>
        {question.edited ? (
          <PulsingCircle isPulsing={previousStep === questionIndex - 1} />
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <div  className="stepper">
        {questions.map((question, index) => renderQuestionStep(question, index, colWidth))}
    </div>
  );
};

export default LiveStepper;
