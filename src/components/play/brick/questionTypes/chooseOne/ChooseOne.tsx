import React from 'react';
import { Button } from '@material-ui/core';

import './ChooseOne.scss';
import CompComponent from '../Comp';
import {CompQuestionProps} from '../types';
import {ComponentAttempt} from 'components/play/brick/model/model';
import BlueCrossRectIcon from 'components/play/components/BlueCrossRectIcon';
import { HintStatus } from 'components/build/baseComponents/Hint/Hint';
import ReviewEachHint from '../../baseComponents/ReviewEachHint';
import ReviewGlobalHint from '../../baseComponents/ReviewGlobalHint';
import {checkVisibility} from '../../../services/hintService';
import MathInHtml from '../../baseComponents/MathInHtml';
import { QuestionValueType } from 'components/build/investigationBuildPage/buildQuestions/questionTypes/types';
import {ChooseOneChoice} from 'components/interfaces/chooseOne';


interface ChooseOneComponent {
  type: number;
  list: ChooseOneChoice[];
}

interface ChooseOneProps extends CompQuestionProps {
  component: ChooseOneComponent;
  answers: number;
}

interface ChooseOneState {
  activeItem: number;
}

class ChooseOne extends CompComponent<ChooseOneProps, ChooseOneState> {
  constructor(props: ChooseOneProps) {
    super(props);

    let activeItem = -1;
    if (props.answers >= 0) {
      activeItem = props.answers;
    } else if (props.attempt && props.attempt.answer >= 0) {
      activeItem = props.attempt.answer;
    }

    this.state = { activeItem };
  }

  setActiveItem(activeItem: number) {
    this.setState({ activeItem });
  }

  getAnswer(): number {
    return this.state.activeItem;
  }

  mark(attempt: ComponentAttempt, prev: ComponentAttempt): ComponentAttempt {
    const {component} = this.props;
    // If the question is answered in review phase, add 2 to the mark and not 5.
    let markIncrement = prev ? 2 : 5;
    attempt.maxMarks = 5;

    // set attempt.correct to true by answer index.
    attempt.correct = false;
    component.list.forEach((choice, index) => {
      if (attempt.answer === index) {
        if (choice.checked === true) {
          attempt.correct = true;
        }
      }
    });

    // if the attempt is correct, add the mark increment.
    if (attempt.correct) attempt.marks = markIncrement;
    // if there is an answer given and the program is in the live phase, give the student an extra mark.
    else if (attempt.answer != null && !prev) attempt.marks = 1;
    else attempt.marks = 0;

    if (attempt.answer === -1) {
      attempt.marks = 0;
    }
    return attempt;
  }

  renderEachHint(index: number) {
    const isShown = checkVisibility(this.props.attempt, this.props.isPreview);
    const {hint} = this.props.question;

    if (isShown && this.props.question.hint.status === HintStatus.Each && hint.list[index]) {
      return (
        <span className="question-hint" dangerouslySetInnerHTML={{ __html: hint.list[index]}} />
      );
    }
    return "";
  }

  renderData(answer: ChooseOneChoice) {
    if (answer.answerType === QuestionValueType.Image) {
      return <img alt="" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${answer.valueFile}`} />;
    } else {
      return <MathInHtml value={answer.value} />;
    }
  }

  isCorrect(index: number) {
    if (this.props.attempt?.correct) {
      if (index === this.props.attempt?.answer) {
        return true;
      }
    }
    return false;
  }

  renderChoice(choice: ChooseOneChoice, index: number) {
    let isCorrect = this.isCorrect(index);
    let className = "choose-choice";
    const { activeItem } = this.state;

    if (this.props.isPreview) {
      if (choice.checked) {
        className += " correct";
      }
    } else if (index === activeItem) {
      className += " active";
    }

    if (this.props.attempt && index === activeItem) {
      let {answer} = this.props.attempt;
      if (answer >= 0) {
        let intAnswer = parseInt(answer);
        console.log(intAnswer, index);
        if (intAnswer === index) {
          if (isCorrect) {
            className += " correct";
          } else if (isCorrect === false) {
            className += " wrong";
          }
        }
      }
    }

    if (choice.answerType === QuestionValueType.Image) {
      className += " image-choice";
    }

    return (
      <Button
        className={className}
        key={index}
        onClick={() => this.setActiveItem(index)}
      >
        <div style={{lineHeight: 1}}>
          {this.renderData(choice)}
          <ReviewEachHint
            isPhonePreview={this.props.isPreview}
            attempt={this.props.attempt}
            isCorrect={isCorrect}
            index={index}
            hint={this.props.question.hint}
          />
        </div>
      </Button>
    );
  }

  render() {
    return (
      <div className="choose-one-live">
        {(this.props.attempt?.correct === false) ?  <BlueCrossRectIcon /> : ""}
        {
          this.props.component.list.map((choice, index) =>
            this.renderChoice(choice, index)
          )
        }
        <ReviewGlobalHint
          attempt={this.props.attempt}
          isPhonePreview={this.props.isPreview}
          hint={this.props.question.hint}
        />
      </div>
    );
  }
}

export default ChooseOne;
