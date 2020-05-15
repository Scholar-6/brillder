import React from 'react';
import { Button } from '@material-ui/core';

import './ChooseOne.scss';
import CompComponent from '../Comp';
import {CompQuestionProps} from '../types';
import {ComponentAttempt} from 'components/play/brick/model/model';
import BlueCrossRectIcon from 'components/play/components/BlueCrossRectIcon';
import { HintStatus } from 'components/build/baseComponents/Hint/Hint';
import ReviewEachHint from '../../baseComponents/ReviewEachHint';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import {checkVisibility} from '../../../services/hintService';
import MathInHtml from '../../baseComponents/MathInHtml';


interface ChooseOneChoice {
  value: string;
  checked: boolean;
}

interface ChooseOneComponent {
  type: number;
  list: ChooseOneChoice[];
}

interface ChooseOneProps extends CompQuestionProps {
  component: ChooseOneComponent;
  answers: number;
}

interface ChooseOneState {
  activeItem: number;
}

class ChooseOne extends CompComponent<ChooseOneProps, ChooseOneState> {
  constructor(props: ChooseOneProps) {
    super(props);

    let activeItem = -1;
    if (props.answers >= 0) {
      activeItem = props.answers;
    } else if (props.attempt && props.attempt.answer >= 0) {
      activeItem = props.attempt.answer;
    }

    this.state = { activeItem };
  }

  setActiveItem(activeItem: number) {
    this.setState({ activeItem });
  }

  getAnswer(): number {
    return this.state.activeItem;
  }

  getState(entry: number): number {
    if (this.props.attempt?.answer[entry]) {
      if (this.props.attempt.answer[entry].toLowerCase().replace(/ /g, '') === this.props.component.list[entry].value.toLowerCase().replace(/ /g, '')) {
        return 1;
      } else { return -1; }
    } else { return 0; }
  }

  mark(attempt: ComponentAttempt, prev: ComponentAttempt): ComponentAttempt {
    const {component} = this.props;
    // If the question is answered in review phase, add 2 to the mark and not 5.
    let markIncrement = prev ? 2 : 5;
    attempt.maxMarks = 5;

    // set attempt.correct to true by answer index.
    attempt.correct = false;
    component.list.forEach((choice, index) => {
      if (attempt.answer === index) {
        if (choice.checked === true) {
          attempt.correct = true;
        }
      }
    });

    // if the attempt is correct, add the mark increment.
    if (attempt.correct) attempt.marks = markIncrement;
    // if there is an answer given and the program is in the live phase, give the student an extra mark.
    else if (attempt.answer != null && !prev) attempt.marks = 1;
    else attempt.marks = 0;
    return attempt;
  }

  renderEachHint(index: number) {
    const isShown = checkVisibility(this.props.attempt, this.props.isPreview);
    const {hint} = this.props.question;

    if (isShown && this.props.question.hint.status === HintStatus.Each && hint.list[index]) {
      return (
        <span className="question-hint" dangerouslySetInnerHTML={{ __html: hint.list[index]}} />
      );
    }
    return "";
  }

  render() {
    const { activeItem } = this.state;

    return (
      <div className="choose-one-live">
        {(this.props.attempt?.correct === false) ?  <BlueCrossRectIcon /> : ""}
        {
          this.props.component.list.map((input: any, index: number) =>
            <Button
              className={(index === activeItem) ? "choose-choice active" : "choose-choice"}
              key={index}
              onClick={() => this.setActiveItem(index)}>
                <div style={{lineHeight: 1}}>
                  <MathInHtml value={input.value} />
                  <ReviewEachHint
                    isPhonePreview={this.props.isPreview}
                    attempt={this.props.attempt}
                    index={index}
                    hint={this.props.question.hint}
                  />
                </div>
            </Button>
          )
        }
        <ReviewGlobalHint
          attempt={this.props.attempt}
          isPhonePreview={this.props.isPreview}
          hint={this.props.question.hint}
        />
      </div>
    );
  }
}

export default ChooseOne;
