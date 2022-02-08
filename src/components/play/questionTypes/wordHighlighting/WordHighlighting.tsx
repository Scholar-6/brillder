import React from "react";

import "./WordHighlighting.scss";
import CompComponent from "../Comp";
import {CompQuestionProps} from '../types';
import { ComponentAttempt } from "components/play/model";
import { PlayWord, IPlayWordComponent } from 'components/interfaces/word';
import SpriteIcon from "components/baseComponents/SpriteIcon";

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

  componentDidUpdate(prevProp: WordHighlightingProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProp.answers) {
        const words = this.props.component.words.map((w, i) => {
          this.props.answers.forEach(a => {
            if (a === i) {
              w.selected = true;
            }
          });
          return w;
        })
        this.setState({ words });
      }
    } else {
      if (this.state.words !== this.props.component.words) {
        this.setState({ words: this.props.component.words });
      }
    }
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
    // don`t show spaces
    if (word.notSelectable && !word.isBreakLine) {
      return <span key={index} />;
    }

    let className = 'word';

    if (word.bold) {
      className += ' bold';
    }

    if (word.italic) {
      className += ' italic';
    }

    if (word.checked) {
      className += ' correct';
    }
  
    return (
      <span key={index} className={className}>
        {word.text}
      </span>
    );
  }

  renderWord(word: PlayWord, index: number) {
    if (word.isPunctuation) {
      return <span key={index}>{word.text}</span>
    }

    if (this.props.isPreview) {
      return this.renderWordPreview(word, index);
    }
    
    let className = "word";
    
    if (word.selected) {
      className += " active";
    }

    if (word.bold) {
      className += ' bold';
    }

    if (word.italic) {
      className += ' italic';
    }

    if (this.props.attempt && this.props.attempt === this.props.liveAttempt && word.selected && this.props.isReview) {
      let status = this.props.attempt.answer.indexOf(index);
      if (status !== -1) {
        if (word.checked === true) {
          className += " correct";
        } else {
          className += " wrong";
        }
      }
    }

    if (this.props.isBookPreview && word.selected) {
      if (word.checked === true) {
        className += " correct";
      } else {
        className += " wrong";
      }
    }

    // don`t show spaces
    if (word.notSelectable && !word.isBreakLine) {
      return <span key={index} />;
    }

    if (this.props.isDefaultBook) {
      return (
        <span key={index} className={className}>
          {word.text}
          {word.isBreakLine ? <br/> : ""}
        </span>
      );
    }

    return (
      <span
        key={index}
        className={className}
        onClick={() => this.highlighting(index)}
      >
        {word.text}
        {word.isBreakLine ? <br/> : ""}
      </span>
    );
  }

  getWords() {
    const {words} = this.props.component;
    let i = 0;
    let i2 = words.length + 2;
    let html = [];
    for (let word of words) {
      html.push(this.renderWord(word, i));
      if (word.isBreakLine) {
        html.push(<br key={i2} style={{width: '100%'}} />);
        i2++;
      }
      i++;
    }
    return html;
  }

  render() {
    const { component } = this.props;

    if (this.props.isPreview === true && (!component.words || component.words.length === 0)) {
      return <div className="word-highlighting-play">You can have a peek once you highlight the correct words</div>
    }

    return (
      <div className="question-unique-play word-highlighting-play">
        <p><span className="help-text"><SpriteIcon name="highlighter" />Click to highlight.</span></p>
        <div className={`words-container ${this.props.isPreview && 'preview'} ${!component.isPoem ? 'break-lines' : 'lines-inline'}`}>
          {this.getWords()}
        </div>
        <br/>
        {this.renderGlobalHint()}
      </div>
    );
  }
}

export default WordHighlighting;
