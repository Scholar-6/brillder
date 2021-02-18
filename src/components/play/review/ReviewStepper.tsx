import React from "react";

import { Question } from "model/question";
import { ComponentAttempt } from "../model";

import sprite from "assets/img/icons-sprite.svg";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isMobile } from "react-device-detect";

interface ReviewStepperProps {
  attempts: ComponentAttempt<any>[];
  questions: Question[];
  noScrolling?: boolean;
  isEnd?: boolean;
  activeStep?: number;
  handleStep(questionIndex: number): any;
}

const ReviewStepper: React.FC<ReviewStepperProps> = ({
  isEnd,
  noScrolling,
  questions,
  activeStep,
  handleStep,
  attempts,
}) => {
  let questionIndex = 0;

  const renderQuestionStep = (key: number) => {
    const attempt = attempts[questionIndex];
    questionIndex++;
    let index = questionIndex;

    let className = 'step';

    if (activeStep !== undefined && activeStep !== null && activeStep + 1 === questionIndex) {
      className += ' current'
    }

    // render step for invalid question
    if (!attempt) {
      className += ' failed';
      return (
        <div className={className} key={key} onClick={handleStep(index - 1)}>
          <span className={isEnd ? "blue" : ""}>{questionIndex}</span>
          <SpriteIcon name="cancel" className="active text-theme-orange" />
          <div className="underline"><div/></div>
        </div>
      );
    }

    if (attempt.correct) {
      className += ' success';
    } else {
      className += ' failed';
    }

    // render step normal questions
    return (
      <div className={className} key={key} onClick={handleStep(index - 1)}>
        <span className={isEnd ? "blue" : ""}>{questionIndex}</span>
        <SpriteIcon
          name={attempt.correct ? "#ok" : "#cancel"}
          className={`svg active ${attempt.correct ? "text-theme-green" : "text-theme-orange"}`}
        />
        <div className="underline"><div/></div>
      </div>
    );
  };

  let className = 'stepper';
  if (isMobile && noScrolling) {
    className += ' inline';
  }  

  return (
    <div className={className}>
      {questions.map((q, index) => renderQuestionStep(index))}
    </div>
  );
};

export default ReviewStepper;
