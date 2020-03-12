import React from 'react';

import {ComponentAttempt} from '../../model/model';

class CompComponent extends React.Component<any, any> {
  getAnswer() { };

  getAttempt(): ComponentAttempt {
    let att = this.mark({ answer: this.getAnswer(), correct: false, marks: 0, maxMarks: 0 }, this.props.attempt);
    return att;
  };

  mark(attempt: ComponentAttempt, prev: ComponentAttempt): ComponentAttempt { return attempt; }
}

export default CompComponent;
