import React from 'react';

import './ChooseOne.scss';
import { Question } from "components/model/question";
import CompComponent from '../comp';
import { Button } from '@material-ui/core';


interface ChooseOneProps {
  question: Question;
  component: any;
  attempt: any;
  answers: number;
}

interface ChooseOneState {
  activeItem: number;
}

class ChooseOne extends CompComponent {
  constructor(props: ChooseOneProps) {
    super(props);

    let activeItem = -1;
    if (props.answers >= 0) {
      activeItem = props.answers;
    }

    this.state = { activeItem } as ChooseOneState;
  }

  setActiveItem(activeItem: number) {
    this.setState({ activeItem });
  }

  getAnswer(): string[] {
    return this.state.activeItem;
  }

  getState(entry: number): number {
    if (this.props.attempt.answer[entry]) {
      if (this.props.attempt.answer[entry].toLowerCase().replace(/ /g, '') === this.props.component.list[entry].answer.toLowerCase().replace(/ /g, '')) {
        return 1;
      } else { return -1; }
    } else { return 0; }
  }

  mark(attempt: any, prev: any): any {
  }

  render() {
    const { activeItem } = this.state;

    return (
      <div className="choose-one-live">
        {
          this.props.component.list.map((input: any, index: number) =>
            <Button
              className={(index === activeItem) ? "choose-choice active" : "choose-choice"}
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

export default ChooseOne;
