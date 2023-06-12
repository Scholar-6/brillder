import React from 'react';
import { Grid } from '@material-ui/core';
import { ReactSortable } from 'react-sortablejs';
import { isMobile } from 'react-device-detect';

import { CompQuestionProps } from '../types';
import CompComponent from '../Comp';
import ReviewEachHint from 'components/play/baseComponents/ReviewEachHint';
import MathInHtml from '../../baseComponents/MathInHtml';
import { getValidationClassName } from '../service';
import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { isPhone } from 'services/phone';
import PairMatchImageContent from '../pairMatch/PairMatchImageContent';
import Audio from 'components/build/buildQuestions/questionTypes/sound/Audio';
import { ReactComponent as DragIcon } from 'assets/img/drag.svg';
import { fileUrl } from 'components/services/uploadFile';


const MobileTheme = React.lazy(() => import('./themes/Phone'));
const TabletTheme = React.lazy(() => import('./themes/Tablet'));
const DesktopTheme = React.lazy(() => import('./themes/Desktop'));

interface VerticalShuffleChoice {
  value: string;
  index: number;
  valueFile: string;
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
  canDrag: boolean;
  reviewCorrectAnswers: number[];
}

class VerticalShuffle extends CompComponent<VerticalShuffleProps, VerticalShuffleState> {
  constructor(props: VerticalShuffleProps) {
    super(props);

    let userAnswers = this.props.component.list;

    const { attempt } = this.props;

    if (attempt) {
      if (attempt.answer) {
        userAnswers = attempt.answer;
      }
    }

    let canDrag = true;
    if (this.props.isReview && this.props.attempt?.correct) {
      canDrag = false;
    }

    let reviewCorrectAnswers = [];

    if (this.props.isReview) {
      for (let i = 0; i < userAnswers.length; i++) {
        const res = this.checkAttemptAnswer(i);
        if (res) {
          reviewCorrectAnswers.push(i);
        }
      }
    }

    this.state = {
      status: DragAndDropStatus.None,
      userAnswers: userAnswers,
      canDrag,
      reviewCorrectAnswers
    };
  }

  componentDidUpdate(prevProp: VerticalShuffleProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProp.answers) {
        this.setState({ userAnswers: this.props.answers as any });
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

    // review. make correct answers static on drag and drop
    if (this.state.reviewCorrectAnswers.length > 0) {
      for (let index of this.state.reviewCorrectAnswers) {

        let answer = null;
        let answerIndex = 0;

        // get correct answer and index
        for (let j = 0; j < userAnswers.length; j++) {
          if (userAnswers[j].index === index) {
            answerIndex = j;
            answer = userAnswers[j];
          }
        }

        // change answer position
        if (answer) {
          userAnswers.splice(answerIndex, 1);
          userAnswers.splice(index, 0, answer);
        }
      }
    }

    this.setState({ status, userAnswers });
  }

  checkImages() {
    return !!this.props.component.list.find(a => a.valueFile);
  }

  getAnswer(): any[] {
    return this.state.userAnswers;
  }

  UNSAFE_componentWillUpdate(props: VerticalShuffleProps) {
    if (!this.props.isPreview) { return; }

    if (props.component && props.component.list) {
      if (this.state.userAnswers !== props.component.list) {
        this.setState({ userAnswers: props.component.list });
      }
    }
  }

  checkAttemptAnswer(index: number) {
    if (this.props.isReview && this.props.attempt) {
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
        <Grid container direction="row" justifyContent="center">
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
        <Grid container direction="row" justifyContent="center">
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
      return <PairMatchImageContent
        fileName={answer.valueFile} imageCaption={answer.imageCaption}
        imageSource={answer.imageSource} />;
    } else if (answer.answerType === QuestionValueType.Sound) {
      return (
        <div>
          {answer.valueFile &&
          <div className="flex-align image-container-v4">
            <img
              alt="" src={fileUrl(answer.valueFile)} width="100%"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            />
          </div>}
          <Audio src={answer.soundFile} />
          <div>{answer.soundCaption}</div>
        </div>
      );
    } else {
      return <MathInHtml value={answer.value} />;
    }
  }

  renderAnswer(answer: any, i: number) {
    const isCorrect = this.checkAttemptAnswer(i);
    let className = "vertical-shuffle-choice";

    if (!this.props.isPreview && this.props.attempt && this.props.isReview) {
      if (this.state.status !== DragAndDropStatus.Changed) {
        className += getValidationClassName(isCorrect);
      }
    }

    if (this.props.isBookPreview) {
      className += getValidationClassName(isCorrect);
    }

    if (answer.answerType === QuestionValueType.Sound && answer.valueFile) {
      className += " sound-with-image";
    }

    const hasHint = this.props.isReview || this.props.isPreview;

    return (
      <div key={i} className={className}>
        <div className={`vertical-content unselectable ${hasHint ? '' : 'full-height'} ${answer.answerType === QuestionValueType.Sound ? 'sound-type-d34' : ''}`}>
          <Grid container direction="row" justifyContent="center">
            <div className="circle-index">
              <div>
                {i + 1}
              </div>
            </div>
            <div className="ver-data-d34">
              {this.renderData(answer)}
            </div>
          </Grid>
        </div>
        {this.renderEachHint(i, answer, isCorrect)}
      </div>
    );
  }

  renderAnswers() {
    return this.state.userAnswers.map((answer, i) => this.renderAnswer(answer, i));
  }

  renderPhone() {
    const haveImage = this.checkImages();
    return (
      <div className="question-unique-play vertical-shuffle-play">
        <span className="help-text">
          <DragIcon />Press and hold to reorder.   {haveImage && <span><SpriteIcon name="f-zoom-in" />Double tap images to zoom.</span>}
        </span>
        {this.props.isBookPreview ? (
          <div>{this.renderAnswers()}</div>
        ) : (
          <ReactSortable
            list={this.state.userAnswers}
            animation={150}
            delay={100}
            className="verical-shuffle-sort-list"
            style={{ display: "inline-block" }}
            group={{ name: "cloning-group-name" }}
            setList={(choices) => this.setUserAnswers(choices)}
          >
            {this.renderAnswers()}
          </ReactSortable>
        )}
      </div>
    );
  }

  renderDesktop() {
    const haveImage = this.checkImages();
    return (
      <div className="question-unique-play vertical-shuffle-play">
        <p><span className="help-text"><DragIcon />Drag to rearrange.   {haveImage && <span>Hover over images to zoom.</span>}
          {!isPhone() && isMobile &&
            <span>
              <SpriteIcon name="hero-cursor-click" />
              Click and hold to move if using an Apple Pencil
            </span>}
        </span>
        </p>
        {this.props.isBookPreview || !this.state.canDrag ? (
          <div>{this.renderAnswers()}</div>
        ) : (
          <ReactSortable
            list={this.state.userAnswers}
            animation={100}
            className="verical-shuffle-sort-list"
            style={{ display: "inline-block" }}
            group={{ name: "cloning-group-name" }}
            setList={(choices) => this.setUserAnswers(choices)}
          >
            {this.renderAnswers()}
          </ReactSortable>
        )}
        {this.renderGlobalHint()}
      </div>
    )
  }

  render() {
    return (
      <React.Suspense fallback={<></>}>
        {isPhone() ? <MobileTheme /> : isMobile ? <TabletTheme /> : <DesktopTheme />}
        {isPhone() ? this.renderPhone() : this.renderDesktop()}
      </React.Suspense>
    );
  }
}

export default VerticalShuffle;
