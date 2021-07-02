import React from "react";

import { Question } from "model/question";
import { ComponentAttempt } from "../../model";

import FailedStep from '../../baseComponents/step/FailedStep';
import SuccessStep from '../../baseComponents/step/SuccessStep';
import AmberStep from '../../baseComponents/step/AmberStep';

interface ReviewStepperProps {
  attempts: ComponentAttempt<any>[];
  questions: Question[];
  handleStep(questionIndex: number): any;
}

const EndingStepper: React.FC<ReviewStepperProps> = ({
  questions,
  attempts,
}) => {
  let questionIndex = 0;

  const renderQuestionStep = (key: number) => {
    const attempt = attempts[questionIndex];
    questionIndex++;
    let index = questionIndex;

    // In the play-preview review there is no stored attempt?
    // TODO figure out how to handle this properly on play-preview
    if (attempt && (attempt.liveCorrect || attempt.reviewCorrect)) {
      if (attempt.liveCorrect && attempt.reviewCorrect) {
        return <SuccessStep key={index} index={index} handleStep={() => { }} />
      }
      return <AmberStep key={index} index={index} handleStep={() => { }} />
    }
    return <FailedStep key={index} index={index} handleStep={() => { }} />;
  };

  return (
    <div className="stepper">
      {questions.map((q, index) => renderQuestionStep(index))}
    </div>
  );
};

export default EndingStepper;
