import React from 'react';

import './ChooseSeveral.scss';
import { Question } from "components/model/question";
import CompComponent, { ComponentAttempt } from '../comp';
import { Button } from '@material-ui/core';

interface ChooseOneProps {
  question: Question;
  component: any;
  attempt: any;
  answers: number[];
}

interface ChooseOneState {
  activeItems: number[];
}

class ChooseSeveral extends CompComponent {
  constructor(props: ChooseOneProps) {
    super(props);

    let activeItems: number[] = [];
    if (props.answers && props.answers.length > 0) {
      activeItems = props.answers;
    }

    this.state = { activeItems } as ChooseOneState;
  }

  setActiveItem(activeItem: number) {
    let { activeItems } = this.state as ChooseOneState;
    let found = activeItems.find(i => i === activeItem);
    if (found) {
      activeItems.splice(found, 1);
    } else {
      activeItems.push(activeItem);
    }
    this.setState({ activeItems });
  }

  getAnswer(): number[] {
    return this.state.activeItems;
  }

  getState(entry: number): number {
    if (this.props.attempt.answer[entry]) {
      if (this.props.attempt.answer[entry].toLowerCase().replace(/ /g, '') === this.props.component.list[entry].answer.toLowerCase().replace(/ /g, '')) {
        return 1;
      } else { return -1; }
    } else { return 0; }
  }

  mark(attempt: ComponentAttempt, prev: ComponentAttempt): ComponentAttempt {
    console.log('mark attempt', attempt)
    // If the question is answered in review phase, add 2 to the mark and not 5.
    let markIncrement = prev ? 2 : 5;
    // set attempt.correct to true if the answer is 0.
    attempt.correct = (attempt.answer == 0);
    attempt.maxMarks = 5;
    // if the attempt is correct, add the mark increment.
    if (attempt.correct) attempt.marks = markIncrement;
    // if there is an answer given and the program is in the live phase, give the student an extra mark.
    else if (attempt.answer != null && !prev) attempt.marks = 1;
    else attempt.marks = 0;
    return attempt;
  }

  render() {
    const { activeItems } = this.state as ChooseOneState;
    const { component } = this.props;

    return (
      <div className="choose-one-live">
        {
          component.list.map((input: any, index: number) =>
            <Button
              className={(index === activeItems.find(i => i === index)) ? "choose-choice active" : "choose-choice"}
              key={index}
              onClick={() => this.setActiveItem(index)}>
              {input.value}
            </Button>
          )
        }
      </div>
    );
  }
}

export default ChooseSeveral;
