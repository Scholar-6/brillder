import React from "react";
import { Grid, Select } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

import CompComponent from "../Comp";
import "./MissingWord.scss";
import {CompQuestionProps} from '../types';
import { ComponentAttempt } from "components/play/brick/model";
import ReviewEachHint from 'components/play/brick/baseComponents/ReviewEachHint';
import ReviewGlobalHint from "../../baseComponents/ReviewGlobalHint";
import PageLoader from "components/baseComponents/loaders/pageLoader";


interface MissingWordProps extends CompQuestionProps {
  component: any;
  attempt: ComponentAttempt<any>;
  answers: number[];
}

interface MissingWordState {
  userAnswers: any[];
  choices: any[];
}

class MissingWord extends CompComponent<MissingWordProps, MissingWordState> {
  constructor(props: MissingWordProps) {
    super(props);
    let userAnswers: any[] = [];
    if (props.answers && props.answers.length > 0) {
      userAnswers = props.answers;
    } else if (props.attempt?.answer?.length > 0) {
      props.attempt.answer.forEach((a: number) => userAnswers.push(a));
    } else {
      props.component.choices.forEach(() => userAnswers.push({ value: -1 }));
    }

    this.state = { userAnswers, choices: props.component.choices };
  }

  UNSAFE_componentWillReceiveProps(props: MissingWordProps) {
    if (props.component) {
      let userAnswers: any[] = [];

      if (props.attempt?.answer?.length > 0) {
        props.attempt.answer.forEach((a: number) => userAnswers.push(a));
      } else {
        props.component.choices.forEach(() => userAnswers.push({ value: -1 }));
      }
      this.setState({ userAnswers });
    }
  }

  setUserAnswer(e: any, index: number) {
    let userAnswers = this.state.userAnswers;
    userAnswers[index].value = e.target.value as number;
    this.setState({ userAnswers });
    if (this.props.onAttempted) {
      this.props.onAttempted();
    }
  }

  getAnswer(): number[] {
    return this.state.userAnswers;
  }

  mark(attempt: any, prev: any): any {
    const markValue = 5;
    const markIncrement = prev ? 2 : markValue;

    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = this.state.choices.length * 5;

    this.state.userAnswers.forEach((choice, i) => {
      if (this.state.choices[i].answers[choice.value]?.checked === true) {
        attempt.marks += markIncrement;
      } else {
        attempt.correct = false;
      }
    });

    attempt.answer = this.state.userAnswers;
    if (attempt.marks === 0 && attempt.answer !== [] && !prev) {
      attempt.marks = 1;
    }

    let noAnswer = true;
    for (let answer of attempt.answer) {
      if (answer.value !== -1) {
        noAnswer = false;
      }
    }

    if (noAnswer) {
      attempt.marks = 0;
    }
    return attempt;
  }

  renderSelect(choice: any, index: number) {
    if (!this.state.userAnswers[index]) { return <PageLoader content="...Loading..." />;}
    let {value} = this.state.userAnswers[index];
    if (value === -1) value = '';
    return (
      <Select
        className="missing-select"
        value={value}
        onChange={e => this.setUserAnswer(e, index)}
      >
        {choice.answers.map((a: any, i: number) => (
          <MenuItem key={i} value={i}>
            {a.value}
          </MenuItem>
        ))}
      </Select>
    );
  }

  renderEachHint(index: number) {
    const {attempt} = this.props;
    if (attempt && attempt.answer) {
      let isCorrect = false;
      let choice = this.props.component.choices[index];
      let attemptedAnswer = attempt.answer[index].value;
      let answer = choice.answers[attemptedAnswer];
      if (answer && answer.checked) {
        isCorrect = true;
      }
      return (
        <ReviewEachHint
          isPhonePreview={this.props.isPreview}
          isReview={this.props.isReview}
          isCorrect={isCorrect}
          index={index}
          hint={this.props.question.hint}
        />
      );
    }
    if (this.props.isPreview) {
      return (
        <ReviewEachHint
          isPhonePreview={this.props.isPreview}
          isReview={this.props.isReview}
          isCorrect={false}
          index={index}
          hint={this.props.question.hint}
        />
      );
    }
    return "";
  }

  render() {
    const { component } = this.props;

    return (
      <div className="missing-word-live">
        {component.choices.map((choice: any, index: number) => (
          <div key={index} className="missing-word-choice">
            <span>
              {choice.before}
              {this.renderSelect(choice, index)}
              {choice.after}
            </span>
            <Grid container direction="row" justify="center">
              {this.renderEachHint(index)}
            </Grid>
          </div>
        ))}
        <ReviewGlobalHint
          isReview={this.props.isReview}
          attempt={this.props.attempt}
          isPhonePreview={this.props.isPreview}
          hint={this.props.question.hint}
        />
      </div>
    );
  }
}

export default MissingWord;
