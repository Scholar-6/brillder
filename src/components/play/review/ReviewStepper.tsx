import React from "react";

import { Question } from "model/question";
import { ComponentAttempt } from "../model";

import sprite from "assets/img/icons-sprite.svg";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { isMobile } from "react-device-detect";

interface ReviewStepperProps {
  noScrolling?: boolean;
  attempts: ComponentAttempt<any>[];
  questions: Question[];
  isEnd?: boolean;
  handleStep(questionIndex: number): any;
}

const ReviewStepper: React.FC<ReviewStepperProps> = ({
  isEnd,
  noScrolling,
  questions,
  handleStep,
  attempts,
}) => {
  let questionIndex = 0;

  const renderQuestionStep = (key: number) => {
    const attempt = attempts[questionIndex];
    questionIndex++;
    let index = questionIndex;

    // render step for invalid question
    if (!attempt) {
      return (
        <div className="step failed" key={key} onClick={handleStep(index - 1)}>
          <span className={isEnd ? "blue" : ""}>{questionIndex}</span>
          <SpriteIcon name="cancel" className="active text-theme-orange" />
        </div>
      );
    }

    // render step normal questions
    return (
      <div className={`step ${attempt.correct ? 'success' : 'failed'}`} key={key} onClick={handleStep(index - 1)}>
        <span className={isEnd ? "blue" : ""}>{questionIndex}</span>
        <svg className="svg active">
          {/*eslint-disable-next-line*/}
          <use
            href={attempt.correct ? sprite + "#ok" : sprite + "#cancel"}
            className={
              attempt.correct ? "text-theme-green" : "text-theme-orange"
            }
          />
        </svg>
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
