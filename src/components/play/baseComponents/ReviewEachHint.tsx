import React from 'react';

import {checkVisibility} from '../services/hintService';
import {Hint, HintStatus} from 'model/question';
import HintBox from './HintBox';


interface ReviewHintProps {
  isReview?: boolean;
  index: number;
  isCorrect?: boolean;
  isPhonePreview?: boolean;
  hint: Hint;
}

const ReviewEachHint: React.FC<ReviewHintProps> = ({ hint, ...props }) => {
  const isShown = checkVisibility(props.isReview, props.isPhonePreview);

  const hintText = hint.list[props.index];
  let className = "question-hint";
  if (props.isCorrect) {
    className += " correct";
  }

  if (isShown && hint.status === HintStatus.Each && hint.list[props.index]) {
    return (
      <div className={className}>
        <HintBox correct={!!props.isCorrect} value={hintText} />
      </div>
    );
  }

  return <div></div>;
}

export default ReviewEachHint;
