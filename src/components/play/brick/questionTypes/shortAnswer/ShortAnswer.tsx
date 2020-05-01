import React from 'react';
import { Question } from "model/question";
import { TextField, Grid } from '@material-ui/core';
import CompComponent from '../Comp';

import './ShortAnswer.scss';
import { ComponentAttempt } from 'components/play/brick/model/model';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import { HintStatus } from 'components/build/baseComponents/Hint/Hint';


interface ShortAnswerProps {
  question: Question;
  component: any;
  attempt: ComponentAttempt;
  answers: string[];
  isPreview: boolean;
}

interface ShortAnswerState {
  userAnswers: string[]
}

class ShortAnswer extends CompComponent<ShortAnswerProps, ShortAnswerState> {
  constructor(props: ShortAnswerProps) {
    super(props);

    let userAnswers: string[] = [];
    if (props.answers) {
      userAnswers = props.answers;
    } else if (props.attempt?.answer?.length > 0) {
      props.attempt.answer.forEach((a: string) => userAnswers.push(a));
    } else {
      props.component.list.forEach(() => userAnswers.push(''));
    }

    this.state = { userAnswers } as ShortAnswerState;
  }

  setUserAnswer(e: any, index: number) {
    let userAnswers = this.state.userAnswers;
    userAnswers[index] = e.target.value;
    this.setState({ userAnswers });
  }

  getAnswer(): string[] {
    return this.state.userAnswers;
  }

  getState(entry: number): number {
    if (this.props.attempt.answer[entry]) {
      if (this.props.attempt.answer[entry].toLowerCase().replace(/ /g, '') === this.props.component.list[entry].answer.toLowerCase().replace(/ /g, '')) {
        return 1;
      } else { return -1; }
    } else { return 0; }
  }

  mark(attempt: any, prev: any): any {
    // If the question is answered in review phase, add 2 to the mark and not 5.
    let markIncrement = prev ? 2 : 5;
    attempt.correct = true;
    attempt.marks = 0;
    // The maximum number of marks is the number of entries * 5.
    attempt.maxMarks = this.props.component.list.length * 5;
    // For every entry...
    this.props.component.list.forEach((answer:any, index: number) => {
      // if there is an answer given...
      if (this.state.userAnswers[index]) {
        // and the answer is equal to the answer in the database (lowercase and whitespace stripped)
        if (this.state.userAnswers[index].toLowerCase().replace(/ /g, '') === answer.value.toLowerCase().replace(/ /g, '')) {
          // and the program is in the live phase...
          if (!prev) {
            // increase the marks by 5.
            attempt.marks += markIncrement;
          }
          // or the answer was already correct before the review...
          else if (prev.answer[index].toLowerCase().replace(/ /g, '') !== answer.value.toLowerCase().replace(/ /g, '')) {
            // increase the marks by 2.
            attempt.marks += markIncrement;
          }
        }
        // if not...
        else {
          // the answer is not correct.
          attempt.correct = false;
        }
      }
      // if not...
      else {
        // the answer is not correct.
        attempt.correct = false;
      }
    })
    // Then, if there are no marks, and there are no empty entries, and the program is in live phase, give the student a mark.
    if (attempt.marks === 0 && this.state.userAnswers.indexOf("") === -1 && !prev) attempt.marks = 1;
    return attempt;
  }

  renderEachHint(index: number) {
    const {hint} = this.props.question;
    if (this.props.attempt?.correct === false && hint.status === HintStatus.Each && hint.list[index]) {
      return <div className="question-hint" dangerouslySetInnerHTML={{ __html: hint.list[index]}} />;
    }
    return "";
  }

  renderTextField(index: number) {
    if (this.props.isPreview) {
      let {value} = this.props.component.list[index];
      return (
        <TextField
          value={value}
          onChange={e => this.setUserAnswer(e, index)}
          label={`Answer ${index + 1}`}
        />
      )
    }
    return (
      <TextField
        value={this.state.userAnswers[index]}
        onChange={e => this.setUserAnswer(e, index)}
        label={`Answer ${index + 1}`}
      />
    )
  }

  render() {
    const { component } = this.props;

    let width = (100 - 1) / component.list.length;

    if (this.props.isPreview) {
      width = 100;
    }

    return (
      <div className="short-answer-live">
        {
          component.list.map((i: any, index: number) =>
            <div key={index} className="short-answer-input" style={{ width: `${width}%` }}>
              <Grid container direction="row" justify="center">
                {this.renderTextField(index)}
              </Grid>
              <Grid container direction="row" justify="center">
                {this.renderEachHint(index)}
              </Grid>
            </div>
          )
        }
        <ReviewGlobalHint attempt={this.props.attempt} hint={this.props.question.hint} />
      </div>
    );
  }
}

export default ShortAnswer;
