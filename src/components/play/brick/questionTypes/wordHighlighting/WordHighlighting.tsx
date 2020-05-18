import React from "react";

import "./WordHighlighting.scss";
import CompComponent from "../Comp";
import {CompQuestionProps} from '../types';
import { ComponentAttempt } from "components/play/brick/model/model";
import ReviewGlobalHint from "../../baseComponents/ReviewGlobalHint";


interface WordHighlightingProps extends CompQuestionProps {
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
  
  UNSAFE_componentWillReceiveProps(props: WordHighlightingProps) {
    this.setState({ words: props.component.words });
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
    let correct = this.state.words.filter(w => w.checked === true);
    attempt.maxMarks = correct.length * 5;

    this.state.words.forEach((word: any, index: number) => {
      if (attempt.answer.indexOf(index) !== -1 && word.checked === true) {
        if (!prev) {
          attempt.marks += markIncrement;
        } else {
          if (prev.answer.indexOf(index) === -1) {
            attempt.marks += markIncrement;
          }
        }
      } else if (word.checked === false && attempt.answer.indexOf(index) === -1) {
      } else {
        attempt.correct = false;
      }
    });

    if(attempt.marks === 0 && !prev) attempt.marks = 1;
    return attempt;
  }

  highlighting(index: number) {
    this.state.words[index].selected = !this.state.words[index].selected;
    this.setState({ words: this.state.words });
  }

  render() {
    const { component } = this.props;

    if (this.props.isPreview === true && (!component.words || component.words.length === 0)) {
      return <div>Words will appear here in correction mode.</div>
    }

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
          isPhonePreview={this.props.isPreview}
          hint={this.props.question.hint}
        />
      </div>
    );
  }
}

export default WordHighlighting;
