import React from 'react';

import {ComponentAttempt} from '../model/model';
import {Hint, HintStatus} from 'model/question';

interface ReviewHintProps {
  attempt?: ComponentAttempt;
  hint: Hint;
}

const ReviewGlobalHint: React.FC<ReviewHintProps> = ({ hint, ...props }) => {
  if (props.attempt?.correct === false && hint.status === HintStatus.All && hint.value) {
    return (
      <div className="question-hint-global">
        <div>{hint.value}</div>
      </div>
    );
  }
  if (props.attempt?.correct === false && hint.status === HintStatus.Each && hint.list.length === 0) {
    return (
      <div className="question-hint-global">
        <div>{hint.value}</div>
      </div>
    );
  }
  return <div></div>;
}

export default ReviewGlobalHint;
