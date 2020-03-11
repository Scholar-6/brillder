import React from 'react';


export interface ComponentAttempt {
  answer: any,
  correct: any,
  marks: number,
  maxMarks: number
}

class CompComponent extends React.Component<any, any> {
  getAnswer() { };

  getAttempt(): ComponentAttempt {
    let att = this.mark({ answer: this.getAnswer(), correct: null, marks: 0, maxMarks: 0 }, this.props.attempt);
    return att;
  };

  mark(attempt: ComponentAttempt, prev: ComponentAttempt): ComponentAttempt { return attempt; }
}

export default CompComponent;
