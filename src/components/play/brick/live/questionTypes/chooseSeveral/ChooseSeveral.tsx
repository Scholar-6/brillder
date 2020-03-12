import React from 'react';

import './ChooseSeveral.scss';
import { Question } from "components/model/question";
import CompComponent from '../comp';
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

    let activeItems:number[] = [];
    if (props.answers && props.answers.length > 0) {
      activeItems = props.answers;
    }

    this.state = { activeItems } as ChooseOneState;
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
    const { component } = this.props;

    return (
      <div className="choose-one-live">
        {
          component.list.map((input: any, index: number) =>
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

export default ChooseSeveral;
