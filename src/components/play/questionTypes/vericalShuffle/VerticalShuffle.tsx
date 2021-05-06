import React from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Grid } from '@material-ui/core';

import './VerticalShuffle.scss';
import {CompQuestionProps} from '../types';
import CompComponent from '../Comp';
import ReviewEachHint from 'components/play/baseComponents/ReviewEachHint';
import MathInHtml from '../../baseComponents/MathInHtml';
import { getValidationClassName } from '../service';
import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { fileUrl } from 'components/services/uploadFile';
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
  switchIndex: number;
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
      switchIndex: -1,
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

  renderData(answer: any) {
    if (answer.answerType === QuestionValueType.Image) {
      return (
        <div className="image-container">
          <img alt="" src={fileUrl(answer.valueFile)} width="100%" />
          {answer.imageCaption && <div>{answer.imageCaption}</div>}
        </div>  
      );
    } else {
      return <MathInHtml value={answer.value} />;
    }
  }

  renderAnswer(answer:any, i: number) {
    const isCorrect = this.checkAttemptAnswer(i);
    const {switchIndex} = this.state;
    let className = "vertical-shuffle-choice";

    if (!this.props.isPreview && this.props.attempt && this.props.isReview) {
      if (this.state.status !== DragAndDropStatus.Changed) {
        className += getValidationClassName(isCorrect);
      }
    }

    if (i === this.state.switchIndex) {
      className += ' active';
    }

    if (this.props.isBookPreview) {
      className += getValidationClassName(isCorrect);
    }

    const hasHint = this.props.isReview || this.props.isPreview;
    
    return (
      <div key={i} className={className} onClick={() => {
        if (switchIndex == -1) {
          this.setState({switchIndex: i});
        } else {
          console.log(switchIndex);
          try {
            const {userAnswers} = this.state;
            const shift1 = userAnswers[switchIndex];
            const shift2 = userAnswers[i];
            userAnswers[switchIndex] = shift2;
            userAnswers[i] = shift1;
            this.setUserAnswers(userAnswers);
            this.setState({switchIndex: -1});
            console.log('switch');
          } catch {}
        }
      }}>
        <div className={`vertical-content ${hasHint ? '' : 'full-height'}`}>
          <Grid container direction="row" justify="center">
            <div className="circle-index">
              {switchIndex === i ? <SpriteIcon name="feather-refresh" /> : i + 1}
            </div>
            {this.renderData(answer)}
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
          <div className="verical-shuffle-sort-list">
            {this.renderAnswers()}
          </div>
        )}
        {this.renderGlobalHint()}
      </div>
    );
  }
}

export default VerticalShuffle;
