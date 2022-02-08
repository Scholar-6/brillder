import React from "react";
import { Grid, Select } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import CompComponent from "../Comp";
import "./MissingWord.scss";
import { CompQuestionProps } from '../types';
import { ComponentAttempt } from "components/play/model";
import ReviewEachHint from 'components/play/baseComponents/ReviewEachHint';
import PageLoader from "components/baseComponents/loaders/pageLoader";
import MathInHtml from "components/play/baseComponents/MathInHtml";

interface MissingComponent {
  choices: any[];
  isPoem?: boolean;
}

interface MissingAttemptAnswer {
  value: number | string;
}

interface MissingWordProps extends CompQuestionProps {
  component: MissingComponent;
  attempt: ComponentAttempt<MissingAttemptAnswer[]>;
  answers: MissingAttemptAnswer[];
}

interface MissingWordState {
  userAnswers: MissingAttemptAnswer[];
  choices: any[];
  oldAttempt: ComponentAttempt<MissingAttemptAnswer[]>;
}

class MissingWord extends CompComponent<MissingWordProps, MissingWordState> {
  constructor(props: MissingWordProps) {
    super(props);
    let userAnswers = this.getUserAnswers(props);
    const oldAttempt = Object.assign({}, this.props.attempt);
    if (oldAttempt.answer) {
      oldAttempt.answer = oldAttempt.answer.map(a => { return { ...a } });
    }
    this.state = { userAnswers, choices: props.component.choices, oldAttempt };
  }

  getUserAnswers(props: MissingWordProps) {
    let userAnswers: MissingAttemptAnswer[] = [];
    if (props.answers && props.answers.length > 0) {
      userAnswers = props.answers;
    } else if (props.attempt?.answer?.length > 0) {
      props.attempt.answer.forEach(a => userAnswers.push(a));
    } else {
      props.component.choices.forEach(() => userAnswers.push({ value: -1 }));
    }
    return userAnswers;
  }

  componentDidUpdate(prevProp: MissingWordProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProp.answers) {
        const userAnswers = this.getUserAnswers(this.props);
        this.setState({ userAnswers });
      }
    }
  }

  UNSAFE_componentWillReceiveProps(props: MissingWordProps) {
    if (props.component) {
      let userAnswers: MissingAttemptAnswer[] = [];

      if (props.attempt?.answer?.length > 0) {
        props.attempt.answer.forEach(a => userAnswers.push(a));
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

  getAnswer(): MissingAttemptAnswer[] {
    return this.state.userAnswers;
  }

  prepareAttempt(component: MissingComponent, attempt: ComponentAttempt<MissingAttemptAnswer[]>) {
    attempt.answer = this.state.userAnswers;
    return attempt;
  }

  isAnswerCorrect(index: number) {
    let isCorrect = false;
    const attempt = this.state.oldAttempt;
    if (attempt && attempt.answer && attempt.answer[index]) {
      let choice = this.props.component.choices[index];
      let attemptedAnswer = attempt.answer[index].value;
      let answer = choice.answers[attemptedAnswer];
      if (answer && answer.checked) {
        isCorrect = true;
      }
    }
    return isCorrect;
  }


  renderSelect(choice: any, index: number) {
    if (!this.state.userAnswers[index]) {
      return <PageLoader content="...Loading..." />;
    }
    let { value } = this.state.userAnswers[index];
    if (value === -1) value = '';


    let disabled = false;
    if (this.props.isReview && this.props.attempt === this.props.liveAttempt) {
      disabled = this.isAnswerCorrect(index);
    }

    return (
      <Select
        disabled={disabled}
        className="missing-select"
        value={value}
        IconComponent={ExpandMoreIcon}
        onChange={e => this.setUserAnswer(e, index)}
      >
        {choice.answers.map((a: any, i: number) => (
          <MenuItem key={i} className="missing-choice" value={i}>
            <MathInHtml value={a.value} />
          </MenuItem>
        ))}
      </Select>
    );
  }

  renderEachHint(index: number) {
    const attempt = this.state.oldAttempt;
    if (attempt && attempt.answer && attempt.answer[index]) {
      let isCorrect = false;
      if (this.props.isReview && this.props.attempt === this.props.liveAttempt) {
        isCorrect = this.isAnswerCorrect(index);
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
          <div key={index} className={"missing-word-choice " + (component.isPoem ? 'poem' : '')}>
            <span>
              <MathInHtml value={choice.before} />
              {this.renderSelect(choice, index)}
              <MathInHtml value={choice.after} />
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
