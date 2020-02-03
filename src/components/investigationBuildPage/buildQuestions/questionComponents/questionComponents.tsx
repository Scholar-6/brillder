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
}

const QuestionComponents = ({ history, brickId, question, swapComponents }: QuestionComponentsProps) => {
  const renderDropBox = (component: any, index: number) => {
    const {type} = question;
    switch (type) {
      case (QuestionTypeEnum.ShortAnswer):
        return <SwitchQuestionComponent type={component.type} index={index} swapComponents={swapComponents} uniqueComponent={ShortAnswerComponent} />
      case (QuestionTypeEnum.Categorise):
        return <SwitchQuestionComponent type={component.type} index={index} swapComponents={swapComponents} uniqueComponent={CategoriseComponent} />
      case (QuestionTypeEnum.ChooseOne):
        return <SwitchQuestionComponent type={component.type} index={index} swapComponents={swapComponents} uniqueComponent={ChooseOneComponent} />
      case (QuestionTypeEnum.ChooseSeveral):
        return <SwitchQuestionComponent type={component.type} index={index} swapComponents={swapComponents} uniqueComponent={ChooseSeveralComponent} />
      case (QuestionTypeEnum.HorizontalShuffle):
        return <SwitchQuestionComponent type={component.type} index={index} swapComponents={swapComponents} uniqueComponent={HorizontalShuffleComponent} />
      case (QuestionTypeEnum.LineHighlighting):
        return <SwitchQuestionComponent type={component.type} index={index} swapComponents={swapComponents} uniqueComponent={LineHighlightingComponent} />
      case (QuestionTypeEnum.MissingWord):
        return <SwitchQuestionComponent type={component.type} index={index} swapComponents={swapComponents} uniqueComponent={MissingWordComponent} />
      case (QuestionTypeEnum.PairMatch):
        return <SwitchQuestionComponent type={component.type} index={index} swapComponents={swapComponents} uniqueComponent={PairMatchComponent} />
      case (QuestionTypeEnum.VerticalShuffle):
        return <SwitchQuestionComponent type={component.type} index={index} swapComponents={swapComponents} uniqueComponent={VerticalShuffleComponent} />
      case (QuestionTypeEnum.WordHighlighting):
        return <SwitchQuestionComponent type={component.type} index={index} swapComponents={swapComponents} uniqueComponent={WordHighlightingComponent} />
      default:
        history.push(`/brick/${brickId}/build/investigation/question`);
        return <div>...Loading...</div>
    }
  }

  return (
    <div className="short-answer">
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
