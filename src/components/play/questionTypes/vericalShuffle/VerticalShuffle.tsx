import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Grid } from '@material-ui/core';

import './VerticalShuffle.scss';
import {CompQuestionProps} from '../types';
import CompComponent from '../Comp';
import ReviewEachHint from 'components/play/baseComponents/ReviewEachHint';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import MathInHtml from '../../baseComponents/MathInHtml';
import { getValidationClassName } from '../service';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


interface VerticalShuffleChoice {
  value: string;
  index: number;
}

export interface VerticalShuffleComponent {
  type: number;
  list: VerticalShuffleChoice[];
}

interface VerticalShuffleProps extends CompQuestionProps {
  isTimeover: boolean;
  component: VerticalShuffleComponent;
  answers: number;
}

enum DragAndDropStatus {
  None,
  Init,
  Changed
}

interface VerticalShuffleState {
  status: DragAndDropStatus;
  userAnswers: any[];
}

class VerticalShuffle extends CompComponent<VerticalShuffleProps, VerticalShuffleState> {
  constructor(props: VerticalShuffleProps) {
    super(props);

    let userAnswers = this.props.component.list;

    let {attempt} = this.props;

    if (attempt) {
      if (attempt.answer) {
        userAnswers = attempt.answer;
      }
    }

    this.state = {
      status: DragAndDropStatus.None,
      userAnswers: userAnswers
    };
  }

  componentDidUpdate(prevProp: VerticalShuffleProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProp.answers) {
        this.setState({userAnswers: this.props.answers as any});
      }
    }
  }

  setUserAnswers(userAnswers: any[]) {
    if (this.props.isTimeover) { return; }
    let status = DragAndDropStatus.Changed;
    if (this.state.status === DragAndDropStatus.None) {
      status = DragAndDropStatus.Init;
    }
    if (this.state.status === DragAndDropStatus.Changed && this.props.onAttempted) {
      this.props.onAttempted();
    }
    this.setState({ status, userAnswers });
  }

  getAnswer(): any[] {
    return this.state.userAnswers;
  }

  UNSAFE_componentWillUpdate(props: VerticalShuffleProps) {
    if (!this.props.isPreview) { return; }
    
    if (props.component && props.component.list) {
      if (this.state.userAnswers !== props.component.list) {
        this.setState({userAnswers: props.component.list});
      }
    }
  }

  checkAttemptAnswer(index: number) {
    if (this.props.attempt && this.props.attempt.answer) {
      let answer = this.props.attempt.answer[index];
      if (answer.index - index === 0) {
        return true;
      }
    }
    return false;
  }

  renderEachHint(i: number, answer: any, isCorrect: boolean) {
    if (this.props.isPreview) {
      return (
        <Grid container direction="row" justify="center">
          <ReviewEachHint
            isPhonePreview={this.props.isPreview}
            isReview={this.props.isReview}
            isCorrect={isCorrect}
            index={i}
            hint={this.props.question.hint}
          />
        </Grid>
      )
    } else if (this.props.isReview) {
      return (
        <Grid container direction="row" justify="center">
          <ReviewEachHint
            isPhonePreview={this.props.isPreview}
            isReview={this.props.isReview}
            isCorrect={isCorrect}
            index={answer.index}
            hint={this.props.question.hint}
          />
        </Grid>
      );
    }
    return "";
  }

  renderAnswer(answer:any, i: number) {
    let isCorrect = this.checkAttemptAnswer(i);
    let className = "vertical-shuffle-choice";

    if (!this.props.isPreview && this.props.attempt && this.props.isReview) {
      if (this.state.status !== DragAndDropStatus.Changed) {
        className += getValidationClassName(isCorrect);
      }
    }

    if (this.props.isBookPreview) {
      className += getValidationClassName(isCorrect);
    }

    let hasHint = this.props.isReview || this.props.isPreview;
    
    return (
      <div key={i} className={className}>
        <div className={`vertical-content ${hasHint ? '' : 'full-height'}`}>
          <Grid container direction="row" justify="center">
            <MathInHtml value={answer.value} />
          </Grid>
          {this.renderEachHint(i, answer, isCorrect)}
        </div>
      </div>
    );
  }

  renderAnswers() {
    return this.state.userAnswers.map((answer, i) => this.renderAnswer(answer, i));
  }

  render() {
    return (
      <div className="question-unique-play vertical-shuffle-play">
        <p><span className="help-text">Drag to rearrange.</span></p>
        {this.props.isBookPreview ? (
          <div>{this.renderAnswers()}</div>
        ) : (
          <ReactSortable
            list={this.state.userAnswers}
            animation={150}
            className="verical-shuffle-sort-list"
            style={{display:"inline-block"}}
            group={{ name: "cloning-group-name" }}
            setList={(choices) => this.setUserAnswers(choices)}
          >
            {this.renderAnswers()}
          </ReactSortable>
        )}
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

export default VerticalShuffle;
