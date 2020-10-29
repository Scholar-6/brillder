import React from 'react';
import { Button } from '@material-ui/core';

import './ChooseSeveral.scss';
import { CompQuestionProps } from '../types';
import { ComponentAttempt } from 'components/play/model';
import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { ChooseOneAnswer } from 'components/build/buildQuestions/questionTypes/chooseOneBuild/types';
import { ActiveItem } from '../chooseOne/ChooseOne';

import MathInHtml from '../../baseComponents/MathInHtml';
import CompComponent from '../Comp';
import ReviewEachHint from 'components/play/baseComponents/ReviewEachHint';
import ReviewGlobalHint from 'components/play/baseComponents/ReviewGlobalHint';

export type ChooseSeveralAnswer = ActiveItem[];

interface ChooseSeveralProps extends CompQuestionProps {
  component: any;
  attempt: ComponentAttempt<ChooseSeveralAnswer>;
  answers: ActiveItem[];
}

interface ChooseSeveralState {
  activeItems: ActiveItem[];
}

class ChooseSeveral extends CompComponent<ChooseSeveralProps, ChooseSeveralState> {
  constructor(props: ChooseSeveralProps) {
    super(props);

    let activeItems = this.getActiveItems(props);
    this.state = { activeItems };
  }

  getActiveItems(props: ChooseSeveralProps) {
    let activeItems: ActiveItem[] = [];
    if (props.answers && props.answers.length > 0) {
      activeItems = props.answers;
    } else if (props.attempt?.answer.length > 0) {
      activeItems = Object.assign([], props.attempt.answer);
    }
    return activeItems;
  }

  componentDidUpdate(prevProp: ChooseSeveralProps) {
    if (this.props.isBookPreview) {
      if (this.props.answers !== prevProp.answers) {
        const activeItems = this.getActiveItems(this.props);
        this.setState({activeItems});
      }
    }
  }

  setActiveItem(realIndex: number, index: number) {
    let { activeItems } = this.state;
    let found = activeItems.findIndex(i => i.shuffleIndex === index);
    if (found >= 0) {
      activeItems.splice(found, 1);
    } else {
      activeItems.push({realIndex, shuffleIndex: index});
    }
    if (activeItems.length >= 2 && this.props.onAttempted) {
      this.props.onAttempted();
    }
    this.setState({ activeItems });
  }

  getAnswer() {
    return this.state.activeItems;
  }

  checkBookChoice(choice: ChooseOneAnswer, index: number) {
    const { answer } = this.props.attempt;
    const found = answer.find(a => a.realIndex === index);
    if (found) {
      if (choice.checked) {
        return true;
      } else {
        return false;
      }
    }
    return null;
  }

  checkChoice(choice: ChooseOneAnswer, index: number) {
    if (this.props.attempt && this.props.isReview) {
      const { answer } = this.props.attempt;
      const found = answer.find(a => a.shuffleIndex === index);
      if (found !== undefined && found) {
        if (choice.checked) {
          return true;
        } else {
          return false;
        }
      }
    }
    return null;
  }

  renderData(answer: ChooseOneAnswer) {
    if (answer.answerType === QuestionValueType.Image) {
      return <img alt="" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${answer.valueFile}`} width="100%" />;
    } else {
      return <MathInHtml value={answer.value} />;
    }
  }

  getBookPreviewClass(active: ActiveItem | undefined, isCorrect: boolean | null) {
    let className = "choose-choice";

    if (active && active.realIndex >= 0) {
      className += " active";
      if (isCorrect === true) {
        className += " correct";
      } else if (isCorrect === false) {
        className += " wrong";
      }
    }
    if (!isCorrect) {
      isCorrect = false;
    }
    return className;
  }


  getButtonClass(choice: any, active: ActiveItem | undefined, isCorrect: boolean | null) {
    let className = "choose-choice";

    if (this.props.isPreview) {
      if (choice.checked) {
        className += " correct";
      }
    } else {
      if (active && active.shuffleIndex >= 0) {
        className += " active";
        if (isCorrect === true) {
          className += " correct";
        } else if (isCorrect === false) {
          className += " wrong";
        }
      }
      if (!isCorrect) {
        isCorrect = false;
      }
    }

    if (choice.answerType === QuestionValueType.Image) {
      className += " image-choice";
    }
    return className;
  }

  renderButton(choice: any, index: number) {
    let isCorrect = this.checkChoice(choice, index);
    let active = this.state.activeItems.find(i => i.shuffleIndex === index);

    let className = '';
    if (this.props.isBookPreview) {
      isCorrect = this.checkBookChoice(choice, index);
      active = this.state.activeItems.find(i => i.realIndex === index);
      className = this.getBookPreviewClass(active, isCorrect);
    } else {
      className = this.getButtonClass(choice, active, isCorrect);
    }

    return (
      <Button
        className={className}
        key={index}
        onClick={() => this.setActiveItem(choice.index, index)}
      >
        {this.renderData(choice)}
        {this.props.isPreview ?
          <ReviewEachHint
            isPhonePreview={true}
            isReview={false}
            isCorrect={isCorrect ? isCorrect : false}
            index={index}
            hint={this.props.question.hint}
          />
          : this.props.isReview &&
          <ReviewEachHint
            isPhonePreview={false}
            isReview={true}
            isCorrect={isCorrect ? isCorrect : false}
            index={choice.index as number}
            hint={this.props.question.hint}
          />
        }
      </Button>
    );
  }

  render() {
    const { component } = this.props;

    return (
      <div className="question-unique-play choose-several-live">
        {
          this.props.isReview && <p className="help-text">Choose more than one option.</p>
        }
        {
          component.list.map((choice: any, index: number) => this.renderButton(choice, index))
        }
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

export default ChooseSeveral;
