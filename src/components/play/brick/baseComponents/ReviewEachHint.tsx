import React from 'react';

import {checkVisibility} from '../../services/hintService';
import {ComponentAttempt} from '../model/model';
import {Hint, HintStatus} from 'model/question';
import MathInHtml from 'components/play/brick/baseComponents/MathInHtml';


interface ReviewHintProps {
  attempt?: ComponentAttempt;
  index: number;
  isCorrect?: boolean;
  isPhonePreview?: boolean;
  hint: Hint;
}

const ReviewEachHint: React.FC<ReviewHintProps> = ({ hint, ...props }) => {
  const isShown = checkVisibility(props.attempt, props.isPhonePreview);

  let hintText = hint.list[props.index];
  if (props.isCorrect) {
    hintText = "N.B. " + hintText;
  }

  if (isShown && hint.status === HintStatus.Each && hint.list[props.index]) {
    return (
      <div className="question-hint">
        <MathInHtml value={hintText} />
      </div>
    );
  }

  return <div></div>;
}

export default ReviewEachHint;
