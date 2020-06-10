
import React from 'react';
import Card from '@material-ui/core/Card';
import { ReactSortable } from 'react-sortablejs';

import './HorizontalShuffle.scss';
import CompComponent from '../Comp';
import {CompQuestionProps} from '../types';
import {ComponentAttempt} from 'components/play/brick/model/model';
import BlueCrossRectIcon from 'components/play/components/BlueCrossRectIcon';
import ReviewEachHint from 'components/play/brick/baseComponents/ReviewEachHint';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';


interface HorizontalShuffleChoice {
  value: string;
  checked: boolean;
}

interface HorizontalShuffleComponent {
  type: number;
  list: HorizontalShuffleChoice[];
}

interface VerticalShuffleProps extends CompQuestionProps {
  component: HorizontalShuffleComponent;
  answers: number;
}

interface HorizontalShuffleState {
  userAnswers: any[];
}

class HorizontalShuffle extends CompComponent<VerticalShuffleProps, HorizontalShuffleState> {
  constructor(props: VerticalShuffleProps) {
    super(props);

    let userAnswers = props.component.list;

    if (this.props.attempt) {
      userAnswers = this.props.attempt.answer;
    }

    this.state = { userAnswers };
  }

  componentWillUpdate(props: VerticalShuffleProps) {
    if (!this.props.isPreview) { return; }
    if (props.component && props.component.list) {
      if (this.state.userAnswers !== props.component.list) {
        this.setState({userAnswers: props.component.list});
      }
    }
  }

  setUserAnswers(userAnswers: any[]) {
    this.setState({ userAnswers });
  }

  getAnswer(): any[] {
    return this.state.userAnswers;
  }

  checkAttemptAnswer(index: number) {
    if (this.props.attempt && this.props.attempt.answer) {
      let answer = this.props.attempt.answer[index];
      if (answer.index - index === 0) {
        return true;
      }
    }
    return false;
  }

  mark(attempt: ComponentAttempt, prev: ComponentAttempt): ComponentAttempt {
    let markIncrement = prev ? 2 : 5;
    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = 0;
    
    attempt.answer.forEach((answer: any, index: number, array: any[]) => {
      if (index !== 0) {
        attempt.maxMarks += 5;
        if(answer.index - array[index-1].index === 1) {
          if(!prev) {
            attempt.marks += markIncrement;
          } else if (prev.answer[index] - prev.answer[index-1] !== 1) {
            attempt.marks += markIncrement;
          }
        } else {
          attempt.correct = false;
        }
      }
    })

    if(attempt.marks === 0 && !prev) attempt.marks = 1;
    return attempt;
  }

  renderAnswer(answer: any, i: number) {
    let isCorrect = this.checkAttemptAnswer(i);
    let className = "horizontal-shuffle-answer";
    if (!this.props.isPreview && this.props.attempt) {
      if (isCorrect) {
        className += " correct";
      } else {
        className += " wrong";
      }
    }

    return (
      <Card className={className} key={i}>
        <div style={{display: "block"}}>{answer.value}</div>
        <div style={{display: "block"}}>
          <ReviewEachHint
            isPhonePreview={this.props.isPreview}
            attempt={this.props.attempt}
            index={i}
            isCorrect={isCorrect}
            hint={this.props.question.hint}
          />
        </div>
      </Card>
    );
  }

  render() {
    return (
      <div className="horizontal-shuffle-play">
        {
          (this.props.attempt?.correct === false) ?  <BlueCrossRectIcon /> : ""
        }
        <ReactSortable
          list={this.state.userAnswers}
          animation={150}
          direction="horizontal"
          setList={(choices) => this.setUserAnswers(choices)}
        >
          {
            this.state.userAnswers.map((answer, i) => (
              this.renderAnswer(answer, i)
            ))
          }
        </ReactSortable>
        <ReviewGlobalHint
          attempt={this.props.attempt}
          isPhonePreview={this.props.isPreview}
          hint={this.props.question.hint}
        />
      </div>
    );
  }
}

export default HorizontalShuffle;
