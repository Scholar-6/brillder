import React from "react";
import { Question } from "components/model/question";
import CompComponent from "../Comp";

import "./WordHighlighting.scss";
import { ComponentAttempt } from "components/play/brick/model/model";
import ReviewGlobalHint from "../../baseComponents/ReviewGlobalHint";

interface WordHighlightingProps {
  question: Question;
  component: any;
  attempt: ComponentAttempt;
  answers: number[];
}

interface WordHighlightingState {
  userAnswers: any[];
  words: any[];
}

class WordHighlighting extends CompComponent<
  WordHighlightingProps,
  WordHighlightingState
> {
  constructor(props: WordHighlightingProps) {
    super(props);
    this.state = { userAnswers: [], words: props.component.words };
  }

  getAnswer(): number[] {
    return this.state.words
      .map((word, index) => ({ w: word, i: index }))
      .filter(word => word.w.selected === true)
      .map(word => word.i);
  }

  mark(attempt: any, prev: any): any {
    let markIncrement = prev ? 2 : 5;
    attempt.correct = true;
    attempt.marks = 0;
    attempt.maxMarks = this.state.words.length * 5;

    this.state.words.forEach((word: any, index: number) => {
      if (attempt.answer.indexOf(index) !== -1 && word.checked === true) {
        if (!prev) {
          attempt.marks += markIncrement;
        } else {
          if (prev.answer.indexOf(index) === -1) {
            attempt.marks += markIncrement;
          }
        }
      } else if (
        word.checked === false &&
        attempt.answer.indexOf(index) === -1
      ) {
        if (!prev) {
          attempt.marks += markIncrement;
        }
      } else {
        attempt.correct = false;
      }
    });

    if (attempt.marks === 0 && !prev) {
      attempt.marks = 1;
    }
    console.log(attempt.marks)
    return attempt;
  }

  highlighting(index: number) {
    this.state.words[index].selected = !this.state.words[index].selected;
    this.setState({ words: this.state.words });
  }

  render() {
    const { component } = this.props;
    console.log(component)

    return (
      <div className="word-highlighting-play">
        <div className="words-container">
          {component.words.map((word: any, index: number) => (
            <span
              key={index}
              className={word.selected ? "active word" : "word"}
              onClick={() => this.highlighting(index)}
            >
              {word.text}&nbsp;
            </span>
          ))}
        </div>
        <br/>
        <ReviewGlobalHint
          attempt={this.props.attempt}
          hint={this.props.question.hint}
        />
      </div>
    );
  }
}

export default WordHighlighting;
