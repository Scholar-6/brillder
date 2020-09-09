import React from 'react';

import {ComponentAttempt} from '../model';


class CompComponent<Props, State> extends React.Component<Props, State> {
  getAnswer() { };

  getAttempt(isReview: boolean): ComponentAttempt<any> {
    let props = this.props as any;
    let att = this.mark({ answer: this.getAnswer(), attempted: true, correct: false, marks: 0, maxMarks: 0 }, props.attempt);
    console.log(att);

    if (att.correct === true) {
      if (isReview) {
        att.reviewCorrect = true;
      } else {
        att.liveCorrect = true;
      }
    }
    return att;
  };

  mark(attempt: ComponentAttempt<any>, prev: ComponentAttempt<any>) { return attempt; }
}

export default CompComponent;
