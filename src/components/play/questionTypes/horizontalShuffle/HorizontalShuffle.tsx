import React from 'react';
import Card from '@material-ui/core/Card';
import { ReactSortable } from 'react-sortablejs';

import './HorizontalShuffle.scss';
import CompComponent from '../Comp';
import {CompQuestionProps} from '../types';
import {ComponentAttempt} from 'components/play/model';
import ReviewEachHint from 'components/play/baseComponents/ReviewEachHint';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import MathInHtml from '../../baseComponents/MathInHtml';
import { getValidationClassName } from '../service';
import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { fileUrl } from 'components/services/uploadFile';


enum DragAndDropStatus {
  None,
  Init,
  Changed
}

interface HorizontalShuffleChoice {
  value: string;
}

export interface HorizontalShuffleComponent {
  type: number;
  list: HorizontalShuffleChoice[];
}

interface VerticalShuffleProps extends CompQuestionProps {
  isTimeover: boolean;
  component: HorizontalShuffleComponent;
  answers: number;
}

interface HorizontalShuffleState {
  status: DragAndDropStatus;
  userAnswers: any[];
}

class HorizontalShuffle extends CompComponent<VerticalShuffleProps, HorizontalShuffleState> {
  constructor(props: VerticalShuffleProps) {
    super(props);

    let userAnswers = props.component.list;

    if (this.props.attempt) {
      if (this.props.attempt.answer) {
        userAnswers = this.props.attempt.answer;
      }
    }

    this.state = { status: DragAndDropStatus.None, userAnswers };
  }

  componentDidUpdate(prevProp: VerticalShuffleProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProp.answers) {
        this.setState({userAnswers: this.props.answers as any});
      }
    }
  }

  UNSAFE_componentWillUpdate(props: VerticalShuffleProps) {
    if (!this.props.isPreview) { return; }
    if (props.component && props.component.list) {
      if (this.state.userAnswers !== props.component.list) {
        this.setState({userAnswers: props.component.list});
      }
    }
  }

  setUserAnswers(userAnswers: any[]) {
    if (this.props.isTimeover) { return; }
    let status = DragAndDropStatus.Changed;
    if (this.state.status === DragAndDropStatus.None) {
      status = DragAndDropStatus.Init;
    }

    if (this.state.status === DragAndDropStatus.Changed
      && this.props.onAttempted) {
      this.props.onAttempted();
    }

    this.setState({ status, userAnswers });
  }

  getAnswer(): any[] {
    return this.state.userAnswers;
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

  prepareAttempt(component: HorizontalShuffleComponent, attempt: ComponentAttempt<any>) {
    if (this.state.status === DragAndDropStatus.Changed) {
      attempt.dragged = true;
    }
    return attempt;
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

  renderAnswer(answer: any, i: number) {
    let isCorrect = this.checkAttemptAnswer(i);
    let className = "horizontal-shuffle-answer";
    if (!this.props.isPreview && this.props.attempt && this.props.isReview) {
      if (this.state.status !== DragAndDropStatus.Changed) {
        className += getValidationClassName(isCorrect);
      }
    }

    if (this.props.isBookPreview) {
      className += getValidationClassName(isCorrect);
    }

    return (
      <Card className={className} key={i}>
          <div style={{display: "block"}} className="answer">
            {this.renderData(answer)}
          </div>
          <div style={{display: "block"}}>
            {this.props.isPreview ?
              <ReviewEachHint
                isPhonePreview={this.props.isPreview}
                isReview={this.props.isReview}
                index={i}
                isCorrect={isCorrect}
                hint={this.props.question.hint}
              /> : this.props.isReview &&
              <ReviewEachHint
                isPhonePreview={this.props.isPreview}
                isReview={this.props.isReview}
                index={answer.index}
                isCorrect={isCorrect}
                hint={this.props.question.hint}
              />
            }
        </div>
      </Card>
    );
  }

  renderAnswers() {
    return this.state.userAnswers.map((answer, i) => this.renderAnswer(answer, i));
  }

  render() {
    return (
      <div className="question-unique-play horizontal-shuffle-play">
        <p><span className="help-text">Drag to rearrange.</span></p>
        {this.props.isBookPreview ? (
          <div>{this.renderAnswers()}</div>
        ) : (
          <ReactSortable
            list={this.state.userAnswers}
            animation={150}
            direction="horizontal"
            setList={(choices) => this.setUserAnswers(choices)}
          >
            {this.renderAnswers()}
          </ReactSortable>
        ) }
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

export default HorizontalShuffle;
