import React from "react";

import "./LineHighlighting.scss";
import CompComponent from "../Comp";
import {CompQuestionProps} from '../types';
import { ComponentAttempt } from "components/play/model";
import ReviewGlobalHint from "../../baseComponents/ReviewGlobalHint";


interface LineHighlightingProps extends CompQuestionProps {
  attempt: ComponentAttempt<any>;
  answers: number[];
}

interface LineHighlightingState {
  userAnswers: any[];
  lines: any[];
}

class LineHighlighting extends CompComponent<
  LineHighlightingProps,
  LineHighlightingState
> {
  constructor(props: LineHighlightingProps) {
    super(props);
    this.state = { userAnswers: [], lines: props.component.lines };
  }

  componentDidUpdate(prevProp: LineHighlightingProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProp.answers) {
        const lines = this.props.component.lines.map((l: any, i:number) => {
          this.props.answers.forEach(a => {
            if (a === i) {
              l.selected = true;
            }
          });
          return l;
        })
        this.setState({lines});
      }
    } else {
      if (this.state.lines !== this.props.component.lines) {
        this.setState({ lines: this.props.component.lines });
      }
    }
  }

  getAnswer(): number[] {
    return this.state.lines
      .map((line, index) => ({ w: line, i: index }))
      .filter(line => line.w.selected === true)
      .map(line => line.i);
  }

  highlighting(index: number) {
    this.state.lines[index].selected = !this.state.lines[index].selected;
    if (this.props.onAttempted) {
      this.props.onAttempted();
    }
    this.setState({ lines: this.state.lines });
  }

  renderLinePreview(line: any, index: number) {
    return (
      <div key={index}>
        <span
          className={line.checked ? "correct line" : "line"}
        >
          {line.text}
        </span>
      </div>
    );
  }

  renderLine(line: any, index: number) {
    if (this.props.isPreview) {
      return this.renderLinePreview(line, index);
    }
    let className = "line";
    if (line.selected) {
      className += " active";
    }

    if (line.selected) {
      if (this.props.attempt && this.props.isReview) {
        let status = this.props.attempt.answer.indexOf(index);
        if (status !== -1) {
          if (line.checked === true) {
            className += " correct";
          } else {
            className += " wrong";
          }
        }
      }

      if (this.props.isBookPreview) {
        if (line.checked === true) {
          className += " correct";
        } else {
          className += " wrong";
        }
      }
    }

    return (
      <div key={index}>
        <span className={className} onClick={() => this.highlighting(index)}>
          {line.text}
        </span>
      </div>
    );
  }

  render() {
    const { component } = this.props;
    if (this.props.isPreview === true && (!component.lines || component.lines.length === 0)) {
      return (
        <div className="line-highlighting-play">
          You can have a peek once you highlight the correct lines
        </div>
      );
    }

    return (
      <div className="question-unique-play line-highlighting-play">
        <p><span className="help-text">Click to highlight.</span></p>
        <div className="lines-container">
          {component.lines.map((line: any, index: number) => (
            this.renderLine(line, index)
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

export default LineHighlighting;
