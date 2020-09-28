import React from "react";

import "./WordHighlighting.scss";
import CompComponent from "../Comp";
import {CompQuestionProps} from '../types';
import { ComponentAttempt } from "components/play/model";
import ReviewGlobalHint from "../../baseComponents/ReviewGlobalHint";
import { PlayWord, IPlayWordComponent } from 'components/interfaces/word';

interface WordHighlightingProps extends CompQuestionProps {
  component: IPlayWordComponent;
  attempt: ComponentAttempt<any>;
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

  highlighting(index: number) {
    this.state.words[index].selected = !this.state.words[index].selected;
    if (this.props.onAttempted) {
      this.props.onAttempted();
    }
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

    if (this.props.attempt && word.selected && this.props.isReview) {
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
      <div className="question-unique-play word-highlighting-play">
        <p className="help-text">Click to highlight.</p>
        <div className="words-container">
          {component.words.map((word: any, index: number) => (
            this.renderWord(word, index)
          ))}
        </div>
        <br/>
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

export default WordHighlighting;
