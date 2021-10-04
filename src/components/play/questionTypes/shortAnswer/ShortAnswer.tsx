import React from "react";
import CompComponent from "../Comp";

import "./ShortAnswer.scss";
import { ComponentAttempt } from "components/play/model";
import ReviewEachHint from "../../baseComponents/ReviewEachHint";
import { CompQuestionProps } from "../types";
import {
  ShortAnswerData,
  ShortAnswerItem,
} from "components/build/buildQuestions/questionTypes/shortAnswerBuild/interface";
import { stripHtml } from "components/build/questionService/ConvertService";
import MathInHtml from "components/play/baseComponents/MathInHtml";
import { getValidationClassName } from "../service";
import { HintStatus } from "model/question";
import QuillShortAnswerPreview from "components/baseComponents/quill/QuillShortAnswerPreview";
import QuillShortAnswer from "components/baseComponents/quill/QuillShortAnswer";

export type ShortAnswerAnswer = string[];

interface ShortAnswerProps extends CompQuestionProps {
  component: ShortAnswerData;
  isTimeover: boolean;
  attempt: ComponentAttempt<ShortAnswerAnswer>;
  answers: string[];
}

interface ShortAnswerState {
  userAnswers: string[];
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
      props.component.list.forEach(() => userAnswers.push(""));
    }

    this.state = { userAnswers } as ShortAnswerState;
  }

  componentDidUpdate(prevProps: ShortAnswerProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProps.answers) {
        this.setState({ userAnswers: this.props.answers });
      }
    }
  }

  setUserAnswer(value: string, index: number) {
    let userAnswers = this.state.userAnswers;
    userAnswers[index] = value;
    if (value && this.props.onAttempted) {
      this.props.onAttempted();
    }
    this.setState({ userAnswers });
  }

  formatAnswer(value: string) {
    return value.toLocaleLowerCase().replace(/ /g, "");
  }

  getAnswer = (): string[] => this.state.userAnswers;

  checkAttemptAnswer(answer: ShortAnswerItem, index: number) {
    const answerValue = stripHtml(answer.value);
    if (this.props.attempt && this.props.attempt.answer) {
      const attepmtValue = stripHtml(this.props.attempt.answer[index]);

      if (
        this.props.attempt &&
        this.props.attempt.answer &&
        this.formatAnswer(attepmtValue) === this.formatAnswer(answerValue)
      ) {
        return true;
      }
    }
    return false;
  }

  prepareAttempt(component: ShortAnswerData, attempt: ComponentAttempt<ShortAnswerAnswer>) {
    attempt.answer = this.state.userAnswers;
    return attempt;
  }

  renderQuill(index: number) {
    let value = '';
    if (this.state.userAnswers) {
      value = this.state.userAnswers[index];
    }
    if (this.props.isPreview) {
      value = this.props.component.list[index].value;
    }

    let placeholder = 'Type your answer here';
    if (this.state.userAnswers.length > 1) {
      placeholder = 'Type Answer ' + (index + 1);
    }

    if (this.props.isBookPreview) {
      return <MathInHtml value={value} />;
    }

    if (this.props.isPreview) {
      return <QuillShortAnswerPreview
        disabled={true}
        data={value}
      />
    }

    return <QuillShortAnswer disabled={false}
      data={value}
      placeholder={placeholder}
      onChange={v => this.setUserAnswer(v, index)}
    />
  }

  renderAnswer(answer: ShortAnswerItem, index: number) {
    let isCorrect = false;
    if (this.props.isReview || this.props.isBookPreview) {
      isCorrect = this.checkAttemptAnswer(answer, index);
    }

    let className = 'short-answer-input';

    if (this.props.isBookPreview) {
      className += getValidationClassName(isCorrect);
    } else {
      if (this.props.isReview) {
        if (isCorrect) {
          className += ' correct';
        } else {
          className += ' wrong';
        }
      }
    }

    if (this.props.question.hint.status === HintStatus.Each) {
      className += ' each';
    }

    return (
      <div key={index} className={className}>
        {this.renderQuill(index)}
        <ReviewEachHint
          isPhonePreview={this.props.isPreview}
          isReview={this.props.isReview}
          isCorrect={isCorrect}
          index={index}
          hint={this.props.question.hint}
        />
      </div>
    );
  }

  render() {
    const { component } = this.props;

    return (
      <div className="question-unique-play short-answer-live">
        {component.list.map((answer, index) => {
          return this.renderAnswer(answer, index);
        })}
        {this.renderGlobalHint()}
      </div>
    );
  }
}

export default ShortAnswer;
