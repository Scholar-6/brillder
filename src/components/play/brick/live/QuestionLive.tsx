import React from 'react';
import { Fab, Grid, FormControlLabel } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import { Question, QuestionComponentTypeEnum, QuestionTypeEnum } from "components/model/question";
import TextLive from '../comp/TextLive';
import QuoteLive from '../comp/QuoteLive';
import ShortAnswer from './questionTypes/shortAnswer/ShortAnswer';
import ChooseOne from './questionTypes/chooseOne/ChooseOne';
import ChooseSeveral from './questionTypes/chooseSeveral/ChooseSeveral';
import './QuestionLive.scss';
import CompComponent from './questionTypes/comp';
import { ComponentAttempt } from '../model/model';


interface QuestionProps {
  attempt?: ComponentAttempt;
  question: Question;
  isLastOne: boolean;
  answers: any;
  next(): void;
}

interface QuestionState {
  answerRef: React.RefObject<CompComponent<any, any>>
}

class QuestionLive extends React.Component<QuestionProps, QuestionState> {
  constructor(props:QuestionProps) {
    super(props);

    this.state = {
      answerRef: React.createRef<CompComponent<any, any>>()
    }
  }

  getAnswer(): any {
    return this.state.answerRef.current?.getAnswer();
  }

  getAttempt() : any {
    if (this.props.attempt?.correct === true) {
      return { answer: this.props.attempt.answer, correct: true, marks: 0, maxMarks: this.props.attempt.maxMarks} as ComponentAttempt;
    }
    return this.state.answerRef.current?.getAttempt();
  }

  render() {
    const { question, isLastOne, next } = this.props;
    const renderUniqueComponent = (component: any, index: number) => {
      let UniqueComponent = {} as any;
      if (question.type === QuestionTypeEnum.ShortAnswer) {
        UniqueComponent = ShortAnswer;
      } else if (question.type === QuestionTypeEnum.ChooseOne) {
        UniqueComponent = ChooseOne;
      } else if (question.type === QuestionTypeEnum.ChooseSeveral) {
        UniqueComponent = ChooseSeveral;
      }
      if (UniqueComponent === {}) {
        return <div key={index}>Unique Component</div>
      }
      return <UniqueComponent
        ref={this.state.answerRef as React.RefObject<any>}
        key={index}
        attempt={this.props.attempt}
        answers={this.props.answers}
        question={question}
        component={component} />
    }

    const renderComponent = (component: any, index: number) => {
      if (component.type === QuestionComponentTypeEnum.Text) {
        return <TextLive key={index} component={component} />
      } else if (component.type === QuestionComponentTypeEnum.Quote) {
        return <QuoteLive key={index} component={component} />
      } else if (component.type === QuestionComponentTypeEnum.Component) {
        return renderUniqueComponent(component, index);
      }
      return <div key={index}></div>
    }

    let text = "Next - Don't panic, you can always come back"
    if (isLastOne) {
      text = "Finished - If you are done you are done"
    }

    if (this.props.attempt && this.props.attempt.correct === true) {
      text = "Finish Brick Attempt";
      return (
        <div>
          <div style={{font: "500 16px/24px Montserrat", color: 'black'}}>Question is correct!</div>
          <Grid container direction="row" justify="flex-end" className="next-question-button-container">
            <FormControlLabel
              className="next-question-button"
              labelPlacement="start"
              control={
                <Fab style={{ background: '#0076B4' }} color="secondary" aria-label="add" onClick={next}>
                  <PlayArrowIcon />
                </Fab>
              }
              label={text}
            />
          </Grid>
        </div>
      )
    }

    return (
      <div>
        {
          question.components.map((component, index) => renderComponent(component, index))
        }
        <Grid container direction="row" justify="flex-end" className="next-question-button-container">
          <FormControlLabel
            className="next-question-button"
            labelPlacement="start"
            control={
              <Fab style={{ background: '#0076B4' }} color="secondary" aria-label="add" onClick={next}>
                <PlayArrowIcon />
              </Fab>
            }
            label={text}
          />
        </Grid>
      </div>
    )
  }
}

export default QuestionLive;
