import React from 'react';

import { checkVisibility } from '../services/hintService';
import { Hint, HintStatus } from 'model/question';
import HintBox from './HintBox';


interface ReviewHintProps {
  isReview?: boolean;
  //attempt?: ComponentAttempt<any>;
  correct: boolean;
  isPhonePreview?: boolean;
  hint: Hint;
}

const ReviewGlobalHint: React.FC<ReviewHintProps> = ({ hint, ...props }) => {
  const isShown = checkVisibility(props.isReview, props.isPhonePreview);

  const renderHint = () => {
    return (
      <div className={`question-hint-global ${props.correct ? 'correct' : ''}`}>
        <HintBox correct={props.correct} value={hint.value} />
      </div>
    );
  }

  if (isShown && hint.status === HintStatus.All && hint.value) {
    return renderHint();
  }
  if (isShown && hint.status === HintStatus.Each && hint.list.length === 0) {
    return renderHint();
  }
  return <div></div>;
}

export default ReviewGlobalHint;
