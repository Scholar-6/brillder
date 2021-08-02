import React from 'react';
import ReviewGlobalHint from '../baseComponents/ReviewGlobalHint';

import {ComponentAttempt} from '../model';
import { mark as markAttempt } from '../services/scoring';
import { CompQuestionProps } from './types';

class CompComponent<Props extends CompQuestionProps, State> extends React.Component<Props, State> {
  getAnswer() { };

  getAttempt(isReview: boolean): ComponentAttempt<any> {
    let att = this.mark(this.props.component, {
      answer: this.getAnswer(),
      attempted: true,
      correct: false,
      marks: 0, 
      maxMarks: 0,
      questionId: this.props.question.id
    });

    if (att.correct === true) {
      if (isReview) {
        att.reviewCorrect = true;
      } else {
        att.liveCorrect = true;
      }
    }
    return att;
  };

  // Called before the marking function. Use this to set up the attempt with the data needed to mark it.
  prepareAttempt(component: any, attempt: ComponentAttempt<any>) {
    return attempt;
  }

  mark(component: any, attempt: ComponentAttempt<any>) {
    this.prepareAttempt(component, attempt);
    return markAttempt(this.props.question.type, component, attempt);
  }

  renderGlobalHint() {
    const correct = this.props.attempt ? this.props.attempt.correct : false;

    return (
      <ReviewGlobalHint
        isReview={this.props.isReview}
        correct={correct}
        isPhonePreview={this.props.isPreview}
        hint={this.props.question.hint}
      />
    );
  }
}

export default CompComponent;
