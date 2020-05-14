import React from 'react';

import {ComponentAttempt} from '../model/model';
import {Hint, HintStatus} from 'model/question';

interface ReviewHintProps {
  attempt?: ComponentAttempt;
  isPhonePreview?: boolean;
  hint: Hint;
}

const ReviewGlobalHint: React.FC<ReviewHintProps> = ({ hint, ...props }) => {
  const checkVisibility = () => {
    if (props.isPhonePreview === true || props.attempt?.correct === true) {
      return true;
    }
    return false;
  }

  const isShown = checkVisibility();

  if (isShown && hint.status === HintStatus.All && hint.value) {
    return (
      <div className="question-hint-global">
        <div dangerouslySetInnerHTML={{ __html: hint.value}} />
      </div>
    );
  }
  if (isShown && hint.status === HintStatus.Each && hint.list.length === 0) {
    return (
      <div className="question-hint-global">
        <div>{hint.value}</div>
      </div>
    );
  }
  return <div></div>;
}

export default ReviewGlobalHint;
