import React from "react";

import "./WordHighlighting.scss";
import CompComponent from "../Comp";
import {CompQuestionProps} from '../types';
import { ComponentAttempt } from "components/play/brick/model/model";
import ReviewGlobalHint from "../../baseComponents/ReviewGlobalHint";
import { PlayWord, IPlayWordComponent } from 'components/interfaces/word';

interface WordHighlightingProps extends CompQuestionProps {
  component: IPlayWordComponent;
  attempt: ComponentAttempt;
  answers: number[];
}

interface WordHighlightingState {
  userAnswers: any[];
  words: PlayWord[];
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

    this.state.words.forEach((word, index) => {
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

    if (attempt.answer.length === 0) {
      attempt.marks = 0;
    }

    return attempt;
  }

  highlighting(index: number) {
    this.state.words[index].selected = !this.state.words[index].selected;
    this.setState({ words: this.state.words });
  }

  renderWordPreview(word: PlayWord, index: number) {
    return (
      <span key={index}>
        <span className={word.checked ? "correct word" : "word"}>
          {word.text}
        </span>
        {word.isBreakLine ? <br /> : ""}
      </span>
    );
  }

  renderWord(word: PlayWord, index: number) {
    if (this.props.isPreview) {
      return this.renderWordPreview(word, index);
    }
    let className = "word";
    
    if (word.selected) {
      className += " active";
    }

    if (this.props.attempt && word.selected) {
      let status = this.props.attempt.answer.indexOf(index);
      if (status !== -1) {
        if (word.checked === true) {
          className += " correct";
        } else {
          className += " wrong";
        }
      }
    }

    return (
      <span
        key={index}
        className={className}
        onClick={() => this.highlighting(index)}
      >
        {word.text} </span>
    );
  }

  render() {
    const { component } = this.props;

    if (this.props.isPreview === true && (!component.words || component.words.length === 0)) {
      return <div className="word-highlighting-play">You can have a peek once you highlight the correct words</div>
    }

    return (
      <div className="word-highlighting-play">
        <div className="words-container">
          {component.words.map((word: any, index: number) => (
            this.renderWord(word, index)
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
