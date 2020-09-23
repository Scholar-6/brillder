import React from "react";
import { Grid } from "@material-ui/core";
import CompComponent from "../Comp";

import "./ShortAnswer.scss";
import { ComponentAttempt } from "components/play/model";
import ReviewEachHint from "../../baseComponents/ReviewEachHint";
import ReviewGlobalHint from "../../baseComponents/ReviewGlobalHint";
import { CompQuestionProps } from "../types";
import {
  ShortAnswerData,
  ShortAnswerItem,
} from "components/build/buildQuestions/questionTypes/shortAnswerBuild/interface";
import { stripHtml } from "components/build/questionService/ConvertService";
import DocumentWirisEditorComponent from "components/baseComponents/ckeditor/DocumentWirisEditor";

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
    if (this.props.attempt.answer) {
      const attepmtValue = this.props.attempt.answer[index];
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

  renderCkeditor(index: number) {
    let value = this.state.userAnswers[index];
    if (this.props.isPreview) {
      value = this.props.component.list[index].value;
    }
    return (
      <DocumentWirisEditorComponent
        data={value}
        disabled={false}
        onChange={v => this.setUserAnswer(v, index)}
        toolbar={["superscript", "subscript"]}
        onBlur={() => { }}
        placeholder={`Answer ${index + 1}`}
      />
    );
  }

  renderAnswer(answer: ShortAnswerItem, width: number, index: number) {
    let isCorrect = false;
    if (this.props.attempt) {
      isCorrect = this.checkAttemptAnswer(answer, index);
    }
    return (
      <div
        key={index}
        className={`short-answer-input ${isCorrect ? "correct" : ""}`}
        style={{ width: `${width}%` }}
      >
        <Grid container direction="row" justify="center">
          {this.renderCkeditor(index)}
        </Grid>
        <Grid container direction="row" justify="center">
          <ReviewEachHint
            isPhonePreview={this.props.isPreview}
            isReview={this.props.isReview}
            isCorrect={isCorrect}
            index={index}
            hint={this.props.question.hint}
          />
        </Grid>
      </div>
    );
  }

  render() {
    const { component } = this.props;
    let width = 100;
    if (component.list && component.list.length >= 1) {
      width = (100 - 1) / component.list.length;
    }

    if (this.props.isPreview) width = 100;

    return (
      <div className="question-unique-play short-answer-live">
        {component.list.map((answer, index) => {
          return this.renderAnswer(answer, width, index);
        })}
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

export default ShortAnswer;
