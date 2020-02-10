import React from 'react';
import { Grid } from '@material-ui/core';

import './questionComponents.scss';
import { Question, QuestionTypeEnum } from '../../../model/question';
import ShortAnswerComponent from '../questionTypes/shortAnswer';
import SwitchQuestionComponent from '../components/QuestionComponentSwitcher';
import CategoriseComponent from '../questionTypes/categorise';
import ChooseOneComponent from '../questionTypes/chooseOne';
import ChooseSeveralComponent from '../questionTypes/chooseSeveral';
import HorizontalShuffleComponent from '../questionTypes/horizontalShuffle';
import LineHighlightingComponent from '../questionTypes/lineHighlighting';
import MissingWordComponent from '../questionTypes/missingWord';
import PairMatchComponent from '../questionTypes/pairMatch';
import VerticalShuffleComponent from '../questionTypes/verticalShuffle';
import WordHighlightingComponent from '../questionTypes/wordHighlighting';

type QuestionComponentsProps = {
  history: any
  brickId: number
  question: Question
  swapComponents: Function
  updateComponent(component: any, index: number):void
}

const QuestionComponents = ({ history, brickId, question, swapComponents, updateComponent }: QuestionComponentsProps) => {
  const renderDropBox = (component: any, index: number) => {
    const updatingComponent = (compData:any) => {
      updateComponent(compData, index);
    }

    const {type} = question;
    let uniqueComponent:any;
    if (type == QuestionTypeEnum.ShortAnswer) {
      uniqueComponent = ShortAnswerComponent;
    } else if (type == QuestionTypeEnum.Categorise) {
      uniqueComponent = CategoriseComponent;
    } else if (type == QuestionTypeEnum.ChooseOne) {
      uniqueComponent = ChooseOneComponent;
    } else if (type == QuestionTypeEnum.ChooseSeveral) {
      uniqueComponent = ChooseSeveralComponent;
    } else if (type == QuestionTypeEnum.HorizontalShuffle) {
      uniqueComponent = HorizontalShuffleComponent;
    } else if (type == QuestionTypeEnum.LineHighlighting) {
      uniqueComponent = LineHighlightingComponent;
    } else if (type == QuestionTypeEnum.MissingWord) {
      uniqueComponent = MissingWordComponent;
    } else if (type == QuestionTypeEnum.PairMatch) {
      uniqueComponent = PairMatchComponent;
    } else if (type == QuestionTypeEnum.VerticalShuffle) {
      uniqueComponent = VerticalShuffleComponent;
    } else if (type == QuestionTypeEnum.WordHighlighting) {
      uniqueComponent = WordHighlightingComponent;
    } else {
      history.push(`/brick/${brickId}/build/investigation/question`);
      return <div>...Loading...</div>
    }
    return <SwitchQuestionComponent
      type={component.type}
      index={index}
      swapComponents={swapComponents}
      component={component}
      updateComponent={updatingComponent}
      uniqueComponent={uniqueComponent} />
  }

  return (
    <div className="questions">
      {
        question.components.map((comp, i) => {
          return (
            <Grid key={i} container direction="row" className="drop-box">
              {
                renderDropBox(comp, i)
              }
            </Grid>
          )
        })
      }
    </div>
  );
}

export default QuestionComponents;
