import React from 'react';
import { Button } from '@material-ui/core';

import '../choose.scss';
import './ChooseOne.scss';
import Audio from 'components/build/buildQuestions/questionTypes/sound/Audio';
import CompComponent from '../../Comp';
import { CompQuestionProps } from '../../types';
import { ComponentAttempt } from 'components/play/model';
import ReviewEachHint from '../../../baseComponents/ReviewEachHint';
import MathInHtml from '../../../baseComponents/MathInHtml';
import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { ChooseOneChoice } from 'components/interfaces/chooseOne';
import PairMatchImageContent from '../../pairMatch/PairMatchImageContent';
import ZoomHelpText from '../../components/ZoomHelpText';
import { isPhone } from 'services/phone';
import { fileUrl } from 'components/services/uploadFile';

export interface ChooseOneComponent {
  type: number;
  list: ChooseOneChoice[];
}

export type ChooseOneAnswer = ActiveItem;

interface ChooseOneProps extends CompQuestionProps {
  component: ChooseOneComponent;
  attempt: ComponentAttempt<ActiveItem>;
  answers: ActiveItem;
}

export interface ActiveItem {
  shuffleIndex: number;
  realIndex: number;
}

interface ChooseOneState {
  isLiveCorrect: boolean;
  activeItem: ActiveItem;
}

class ChooseOne extends CompComponent<ChooseOneProps, ChooseOneState> {
  constructor(props: ChooseOneProps) {
    super(props);
    const activeItem = this.getActiveItem(props);

    let correct = false;

    if (props.isReview) {
      correct = props.attempt.correct;
    }

    this.state = { activeItem, isLiveCorrect: correct };
  }

  getActiveItem(props: ChooseOneProps) {
    let activeItem = { shuffleIndex: -1, realIndex: -1 };
    if (props.answers?.shuffleIndex >= 0) {
      activeItem = props.answers;
    } else if (props.attempt?.answer?.shuffleIndex >= 0) {
      activeItem = props.attempt.answer;
    }
    return activeItem;
  }

  getBookActiveItem(props: ChooseOneProps) {
    let activeItem = { shuffleIndex: -1, realIndex: -1 };
    if (props.attempt?.answer?.shuffleIndex >= 0) {
      activeItem = props.attempt.answer;
    }
    return activeItem;
  }

  componentDidUpdate(prevProp: ChooseOneProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProp.answers) {
        const activeItem = this.getBookActiveItem(this.props);
        this.setState({ activeItem });
      }
    }
  }

  setActiveItem(realIndex: number, activeItem: number) {
    this.setState({ activeItem: { realIndex, shuffleIndex: activeItem } });
    if (this.props.onAttempted) {
      this.props.onAttempted();
    }
  }

  getAnswer() {
    return this.state.activeItem;
  }

  renderData(answer: ChooseOneChoice) {
    if (answer.answerType === QuestionValueType.Image) {
      return <PairMatchImageContent
        fileName={answer.valueFile}
        imageCaption={answer.imageCaption}
        imageSource={answer.imageSource}
      />;
    } else if (answer.answerType === QuestionValueType.Sound) {
      return (
        <div style={{ width: '100%' }}>
          {answer.valueFile &&
          <div className="flex-align image-container-v4">
            <img
              alt="" src={fileUrl(answer.valueFile)} width="100%"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            />
          </div>}
          <Audio src={answer.soundFile} />
          <div>{answer.soundCaption ? answer.soundCaption : 'Click to select'}</div>
        </div>
      );
    } else {
      return <MathInHtml className="unselectable" value={answer.value} />;
    }
  }

  isCorrect(index: number) {
    if (this.props.attempt?.correct) {
      if (index === this.props.attempt?.answer.shuffleIndex) {
        return true;
      }
    }
    return false;
  }

  isResultCorrect(index: number, choice: ChooseOneChoice) {
    if (this.props.isBookPreview) {
      if (this.props.attempt?.answer) {
        if (choice.checked && index === this.props.attempt?.answer.shuffleIndex) {
          return true;
        }
      }
    }

    if (this.props.isReview && this.props.attempt === this.props.liveAttempt) {
      if (this.props.attempt?.answer) {
        if (choice.checked && index === this.props.attempt?.answer.shuffleIndex) {
          return true;
        }
      }
    }
    return false;
  }

  renderBookChoice(index: number, activeItem: ActiveItem, choice: ChooseOneChoice) {
    const isCorrect = this.isResultCorrect(index, choice);
    let className = "choose-choice";

    if (choice.answerType === QuestionValueType.Image) {
      className += " image-choice";
    } else if (choice.answerType === QuestionValueType.Sound) {
      className += " sound-image-choice";
    }

    if (index === activeItem.shuffleIndex) {
      if (isCorrect) {
        className += " correct";
      } else if (isCorrect === false) {
        className += " wrong";
      }
    }
    return (
      <Button className={className} key={index}>
        {this.renderData(choice)}
        <ReviewEachHint
          isPhonePreview={this.props.isPreview}
          isReview={this.props.isReview}
          isCorrect={isCorrect}
          index={index}
          hint={this.props.question.hint}
        />
      </Button>
    );
  }

  renderChoice(choice: ChooseOneChoice, index: number) {
    const { attempt } = this.props;
    let isCorrect = this.isCorrect(index);
    let className = "choose-choice";
    const { activeItem } = this.state;

    if (this.props.isPreview) {
      if (choice.checked) {
        className += " correct";
      }
    } else if (index === activeItem.shuffleIndex) {
      className += " active";
    }

    if (choice.answerType === QuestionValueType.Image) {
      className += " image-choice";
    } else if (choice.answerType === QuestionValueType.Sound) {
      className += " sound-image-choice";
    }

    // book preview
    if (this.props.isBookPreview) {
      return this.renderBookChoice(index, activeItem, choice);
    }
    // if review show correct or wrong else just make answers active
    else if (attempt && index === activeItem.shuffleIndex) {
      let { answer } = attempt;
      if (this.props.isReview) {
        if (answer.shuffleIndex >= 0 && answer.shuffleIndex === index) {
          if (this.props.isReview) {
            if (isCorrect === false) {
              className += " wrong";
            }
          }
        } else {
          className += " active";
        }
      }
    }

    if (this.props.isReview && this.props.liveAttempt?.correct === true && isCorrect == true) {
      className += ' correct';
      isCorrect = true;
    } else {
      isCorrect = false;
    }

    return (
      <div
        className={className}
        key={index}
        onClick={() => {
          if (this.props.liveAttempt?.correct === true) {
            return;
          }
          this.setActiveItem(choice.index, index);
        }}
      >
        {this.renderData(choice)}
        {this.props.isPreview ?
          <ReviewEachHint
            isPhonePreview={true}
            isReview={false}
            isCorrect={isCorrect}
            index={index}
            hint={this.props.question.hint}
          />
          : this.props.isReview &&
          <ReviewEachHint
            isPhonePreview={false}
            isReview={true}
            isCorrect={isCorrect}
            index={choice.index}
            hint={this.props.question.hint}
          />
        }
      </div>
    );
  }

  checkImages() {
    return !!this.props.component.list.find(a => a.valueFile);
  }

  render() {
    const { list } = this.props.component;
    const haveImage = this.checkImages();
    return (
      <div className="question-unique-play choose-one-live">
        {haveImage && <ZoomHelpText />}
        {list.map((choice, index) => this.renderChoice(choice, index))}
        {!isPhone() && this.renderGlobalHint()}
      </div>
    );
  }
}

export default ChooseOne;
