import React from 'react';
import { Fab, Grid, FormControlLabel } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import './QuestionPlay.scss';
import { Question, QuestionComponentTypeEnum, QuestionTypeEnum } from "components/model/question";
import CompComponent from '../questionTypes/Comp';
import { ComponentAttempt } from '../model/model';

import TextLive from '../comp/TextLive';
import QuoteLive from '../comp/QuoteLive';
import ImageLive from '../comp/ImageLive';

import ShortAnswer from '../questionTypes/shortAnswer/ShortAnswer';
import ChooseOne from '../questionTypes/chooseOne/ChooseOne';
import ChooseSeveral from '../questionTypes/chooseSeveral/ChooseSeveral';
import VerticalShuffle from '../questionTypes/vericalShuffle/VerticalShuffle';
import HorizontalShuffle from '../questionTypes/horizontalShuffle/HorizontalShuffle';
import PairMatch from '../questionTypes/pairMatch/PairMatch';
import Sort from '../questionTypes/sort/Sort';
import MissingWord from '../questionTypes/missingWord/MissingWord';
import LineHighlighting from '../questionTypes/lineHighlighting/LineHighlighting';
import WordHighlightingComponent from '../questionTypes/wordHighlighting/WordHighlighting';


interface QuestionProps {
  attempt?: ComponentAttempt;
  question: Question;
  isLastOne: boolean;
  isPreview?: boolean;
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
      } else if (question.type === QuestionTypeEnum.VerticalShuffle) {
        UniqueComponent = VerticalShuffle;
      } else if (question.type === QuestionTypeEnum.HorizontalShuffle) {
        UniqueComponent = HorizontalShuffle;
      } else if (question.type === QuestionTypeEnum.PairMatch) {
        UniqueComponent = PairMatch;
      } else if (question.type === QuestionTypeEnum.Sort) {
        UniqueComponent = Sort;
      } else if (question.type === QuestionTypeEnum.MissingWord) {
        UniqueComponent = MissingWord;
      } else if (question.type === QuestionTypeEnum.LineHighlighting) {
        UniqueComponent = LineHighlighting;
      } else if (question.type === QuestionTypeEnum.WordHighlighting) {
        UniqueComponent = WordHighlightingComponent;
      }

      if (typeof UniqueComponent === "object") {
        return <div key={index}>Not implemented</div>
      }

      return <UniqueComponent
        ref={this.state.answerRef as React.RefObject<any>}
        key={index}
        attempt={this.props.attempt}
        answers={this.props.answers}
        isPreview={this.props.isPreview}
        question={question}
        component={component} />
    }

    const renderComponent = (component: any, index: number) => {
      if (component.type === QuestionComponentTypeEnum.Text) {
        return <TextLive key={index} component={component} />
      } else if (component.type === QuestionComponentTypeEnum.Image) {
        return <ImageLive key={index} component={component} />
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
        {
          !this.props.isPreview ?
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
          : ""
        }
      </div>
    )
  }
}

export default QuestionLive;
