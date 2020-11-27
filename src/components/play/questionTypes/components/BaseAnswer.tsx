import { MainImageProps } from 'components/build/buildQuestions/components/Image/model';
import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import MathInHtml from 'components/play/baseComponents/MathInHtml';
import { fileUrl } from 'components/services/uploadFile';
import React from 'react';

interface Answer extends MainImageProps {
  value: string;
  valueFile: string;
  answerType: QuestionValueType;
}

interface AnswerProps {
  answer: Answer;
}

const BaseAnswer: React.FC<AnswerProps> = ({answer}) => {
  if (answer.answerType === QuestionValueType.Image) {
    return (
      <div className="image-container">
        <img alt="" src={fileUrl(answer.valueFile)} width="100%" />
        {answer.imageCaption && <div>{answer.imageCaption}</div>}
      </div>
    );
  } else {
    return <MathInHtml value={answer.value} />;
  }
}

export default BaseAnswer;
