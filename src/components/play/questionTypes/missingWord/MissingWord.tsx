import React from "react";
import { Grid, Select } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

import CompComponent from "../Comp";
import "./MissingWord.scss";
import {CompQuestionProps} from '../types';
import { ComponentAttempt } from "components/play/model";
import ReviewEachHint from 'components/play/baseComponents/ReviewEachHint';
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
    let userAnswers = this.getUserAnswers(props);
    this.state = { userAnswers, choices: props.component.choices };
  }

  getUserAnswers(props: MissingWordProps) {
    let userAnswers: any[] = [];
    if (props.answers && props.answers.length > 0) {
      userAnswers = props.answers;
    } else if (props.attempt?.answer?.length > 0) {
      props.attempt.answer.forEach((a: number) => userAnswers.push(a));
    } else {
      props.component.choices.forEach(() => userAnswers.push({ value: -1 }));
    }
    return userAnswers;
  }

  componentDidUpdate(prevProp: MissingWordProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProp.answers) {
        const userAnswers = this.getUserAnswers(this.props);
        this.setState({userAnswers});
      }
    }
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

  prepareAttempt(component: any, attempt: ComponentAttempt<any>) {
    attempt.answer = this.state.userAnswers;

    return attempt;
  }

  renderSelect(choice: any, index: number) {
    if (!this.state.userAnswers[index]) {
      return <PageLoader content="...Loading..." />;
    }
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
      <div className="question-unique-play missing-word-live">
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
        {this.renderGlobalHint()}
      </div>
    );
  }
}

export default MissingWord;
