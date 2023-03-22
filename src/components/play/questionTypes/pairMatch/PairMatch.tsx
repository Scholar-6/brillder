import React from 'react';
import { Grid } from '@material-ui/core';
import List from '@material-ui/core/List';
import { isMobile } from 'react-device-detect';

import './PairMatch.scss';
import CompComponent from '../Comp';
import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { Answer } from 'components/build/buildQuestions/questionTypes/pairMatchBuild/types';
import { PairMatchProps, PairMatchState } from './interface';
import MathInHtml from '../../baseComponents/MathInHtml';
import PairMatchOption from './PairMatchOption';
import PairMatchImageContent from './PairMatchImageContent';
import Audio from 'components/build/buildQuestions/questionTypes/sound/Audio';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { isPhone } from 'services/phone';


class PairMatch extends CompComponent<PairMatchProps, PairMatchState> {
  constructor(props: PairMatchProps) {
    super(props);
    let userAnswers = [];

    const { component } = props;

    if (props.isPreview === true) {
      userAnswers = component.list ? component.list : [];
    } else {
      if (this.props.attempt) {
        let choices = this.props.attempt.answer;
        userAnswers = Object.assign([], choices);

        if (this.props.isBookPreview) {
          userAnswers = this.props.answers as any;
        }
      } else {
        userAnswers = component.choices ? component.choices : [];
      }
    }

    //#3682 fix
    if (userAnswers.length === 0) {
      userAnswers = component.list;
    }

    let canDrag = true;
    if (this.props.isReview) {
      canDrag = this.props.attempt?.correct ? false : true;
    }
    this.state = {
      userAnswers, canDrag, animation: false,
      answersRef: React.createRef<any>(),
    };
  }

  UNSAFE_componentWillUpdate(props: PairMatchProps) {
    if (props.isPreview === true && props.component) {
      if (this.state.userAnswers !== props.component.list) {
        this.setState({ userAnswers: props.component.list });
      }
    }
    if (props.isBookPreview === true) {
      if (this.state.userAnswers !== props.answers as any) {
        this.setState({ userAnswers: this.props.answers as any });
      }
    }
  }

  getAnswer(): any[] { return this.state.userAnswers; }

  getState(entry: number): number {
    try {
      if (this.props.isReview && this.props.attempt === this.props.liveAttempt) {
        if (this.props.attempt?.answer[entry]) {
          if (this.props.attempt.answer[entry].index === this.props.component.list[entry].index) {
            return 1;
          } else { return -1; }
        } else { return 0; }
      } else { return 0; }
    } catch {
      return 0;
    }
  }

  getBookState(entry: number): number {
    const answers = this.props.answers as any;
    if (
      answers[entry].value.toLowerCase().replace(/ /g, '') ===
      this.props.component.list[entry].value.toLowerCase().replace(/ /g, '')
    ) {
      return 1;
    } else { return -1; }
  }

  renderAnswerContent(answer: Answer) {
    if (answer.answerType && answer.answerType === QuestionValueType.Image) {
      return (
        <PairMatchImageContent
          fileName={answer.valueFile}
          imageCaption={answer.imageCaption}
          imageSource={answer.imageSource}
        />
      );
    } else if (answer.answerType && answer.answerType === QuestionValueType.Sound) {
      return (
        <div style={{ width: '100%' }}>
          <Audio src={answer.valueSoundFile} />
          <div>{answer.valueSoundCaption ? answer.valueSoundCaption : ''}</div>
        </div>
      );
    }
    return (
      <div
        className="MuiListItemText-root"
        style={{ width: '100%', textAlign: 'center' }}
      >
        <MathInHtml value={answer.value} />
      </div>
    );
  }

  prepareClassName(answer: any) {
    let className = "pair-match-play-choice";
    if (answer.answerType === QuestionValueType.Image) {
      className += " image-choice";
    }
    if (answer.swapping === true) {
      className += " active";
    }
    if (this.props.attempt && this.props.isReview) {
      let state = this.getState(answer.index);
      if (state === 1) {
        className += " correct";
      }
    }

    if (this.props.isBookPreview) {
      try {
        let state = this.getBookState(answer.index);
        if (state === 1) {
          className += " correct";
        } else {
          className += " wrong";
        }
      } catch {
        console.log('can`t find pair match answer');
      }
    }
    return className;
  }

  swapQuestions(answer: any, index: number) {
    // if answer is correct do nothing
    if (this.props.attempt && this.props.isReview && this.props.attempt === this.props.liveAttempt) {
      let state = this.getState(answer.index);
      if (state === 1) {
        return;
      }
    }

    if (this.state.animation === true || !this.state.canDrag) { return; }
    const index2 = this.state.userAnswers.findIndex(a => a.swapping === true);
    if (index2 >= 0) {
      const ulist = [...this.state.userAnswers];
      [ulist[index], ulist[index2]] = [ulist[index2], ulist[index]];
      ulist[index].swapping = false;
      ulist[index2].swapping = false;

      this.setState({ animation: true });

      const parent = this.state.answersRef.current;

      const el1 = parent.children[index];
      const el2 = parent.children[index2];

      var endPt = Math.round(el2.offsetTop - el1.offsetTop);

      let aprop = [] as any[];
      let bprop = [] as any[];

      if (endPt < 0) {
        endPt = -endPt;
        aprop = [{ transform: 'translateY(-' + endPt + 'px)' }];
        bprop = [{ transform: 'translateY(' + endPt + 'px)' }];
      } else {
        aprop = [{ transform: 'translateY(' + endPt + 'px)' }];
        bprop = [{ transform: 'translateY(-' + endPt + 'px)' }];
      }

      const duration = 300;

      el1.animate(aprop, { duration });
      el2.animate(bprop, { duration });

      setTimeout(() => {
        this.setState({ userAnswers: ulist, animation: false });
      }, duration);
    } else {
      answer.swapping = true;
      this.setState({ userAnswers: this.state.userAnswers });
    }
  }

  renderAnswer(answer: any, i: number) {
    const className = this.prepareClassName(answer);

    return (
      <div key={i} className={className} onClick={() => this.swapQuestions(answer, i)}>
        <div className="MuiListItem-root" style={{ height: '100%', textAlign: 'center' }}>
          <div style={{ width: '100%' }}>
            {this.renderAnswerContent(answer)}
          </div>
        </div>
      </div>
    );
  }

  checkImages() {
    return !!this.props.component.list.find((a: any) => a.valueFile || a.optionFile);
  }

  renderPhoneTip(haveImage: boolean) {
    return (
      <span className="help-text">
        {
          haveImage && (isMobile
            ? <span><SpriteIcon name="f-zoom-in" />Double tap images to zoom.</span>
            : <span><SpriteIcon name="f-zoom-in" />Hover over images to zoom.</span>)
        } <SpriteIcon name="pair-match-phone-d3" /> <span>Drag on left to scroll. Tap an answer to swap it for another.</span>
      </span>
    )
  }

  renderHelpers() {
    const haveImage = this.checkImages();

    return (
      <p>
        {isPhone() ? this.renderPhoneTip(haveImage) :
          <span className="help-text">
            <SpriteIcon name="pair-match-phone-d3" /><span>Select an answer to rearrange.</span> {
              haveImage && (isMobile
                ? <span><SpriteIcon name="f-zoom-in" />Double tap images to zoom.</span>
                : <span><SpriteIcon name="f-zoom-in" />Hover over images to zoom.</span>)
            }
          </span>}
        {!isPhone() && isMobile &&
          <span className="help-text">
            <SpriteIcon name="hero-cursor-click" />
            Click and hold to move if using an Apple Pencil
          </span>}
      </p>
    );
  }

  renderOptions() {
    return (
      <List style={{ padding: 0 }} className="answers-list">
        {
          this.props.component.list.map((item: any, i) =>
            <PairMatchOption
              state={this.getState(i)}
              item={item}
              key={i}
              attempt={this.props.liveAttempt}
              isPreview={this.props.isPreview}
              hint={this.props.question.hint}
              isReview={this.props.isReview}
              index={i}
            />
          )
        }
      </List>
    )
  }

  renderAnswers() {
    if (this.props.isBookPreview || this.props.isPreview || !this.state.canDrag) {
      return (
        <div className="answers-list">
          {this.state.userAnswers.map((a: Answer, i: number) => this.renderAnswer(a, i))}
        </div>
      )
    }
    return (
      <div className="answers-list" ref={this.state.answersRef}>
        {
          this.state.userAnswers.map((a: Answer, i: number) => this.renderAnswer(a, i))
        }
      </div>
    );
  }

  render() {
    return (
      <div className="question-unique-play pair-match-play">
        {this.renderHelpers()}
        <Grid container justifyContent="center">
          {this.renderOptions()}
          {this.renderAnswers()}
        </Grid>
        {!isPhone() && this.renderGlobalHint()}
      </div>
    );
  }
}

export default PairMatch;
