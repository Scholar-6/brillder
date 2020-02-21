import React from 'react';
import { Grid, Button } from '@material-ui/core';

import './questionComponents.scss';
import ShortAnswerComponent from '../questionTypes/shortAnswerBuild/shortAnswerBuild';
import SwitchQuestionComponent from '../components/QuestionComponentSwitcher';
import CategoriseComponent from '../questionTypes/categoriseBuild/categoriseBuild';
import ChooseOneComponent from '../questionTypes/chooseOneBuild/chooseOneBuild';
import ChooseSeveralComponent from '../questionTypes/chooseSeveralBuild/chooseSeveralBuild';
import HorizontalShuffleComponent from '../questionTypes/horizontalShuffleBuild/horizontalShuffleBuild';
import LineHighlightingComponent from '../questionTypes/lineHighlightingBuild';
import MissingWordComponent from '../questionTypes/missingWordBuild';
import PairMatchComponent from '../questionTypes/pairMatchBuild/pairMatchBuild';
import VerticalShuffleComponent from '../questionTypes/verticalShuffleBuild/verticalShuffleBuild';
import WordHighlightingComponent from '../questionTypes/wordHighlighting/wordHighlighting';
import SortComponent from '../questionTypes/sortBuild';
import { Question, QuestionTypeEnum } from 'components/model/question';
import { HintState } from 'components/build/baseComponents/Hint/Hint';


type QuestionComponentsProps = {
  history: any
  brickId: number
  question: Question
  swapComponents: Function
  addComponent: Function
  updateComponent(component: any, index: number):void
  setQuestionHint(hintState: HintState): void
}

const QuestionComponents = ({ history, brickId, question, swapComponents, setQuestionHint, updateComponent, addComponent }: QuestionComponentsProps) => {
  const renderDropBox = (component: any, index: number) => {
    const updatingComponent = (compData:any) => {
      updateComponent(compData, index);
    }

    const {type} = question;
    let uniqueComponent:any;
    if (type === QuestionTypeEnum.ShortAnswer) {
      uniqueComponent = ShortAnswerComponent;
    } else if (type === QuestionTypeEnum.Categorise) {
      uniqueComponent = CategoriseComponent;
    } else if (type === QuestionTypeEnum.ChooseOne) {
      uniqueComponent = ChooseOneComponent;
    } else if (type === QuestionTypeEnum.ChooseSeveral) {
      uniqueComponent = ChooseSeveralComponent;
    } else if (type === QuestionTypeEnum.HorizontalShuffle) {
      uniqueComponent = HorizontalShuffleComponent;
    } else if (type === QuestionTypeEnum.LineHighlighting) {
      uniqueComponent = LineHighlightingComponent;
    } else if (type === QuestionTypeEnum.MissingWord) {
      uniqueComponent = MissingWordComponent;
    } else if (type === QuestionTypeEnum.PairMatch) {
      uniqueComponent = PairMatchComponent;
    } else if (type === QuestionTypeEnum.VerticalShuffle) {
      uniqueComponent = VerticalShuffleComponent;
    } else if (type === QuestionTypeEnum.WordHighlighting) {
      uniqueComponent = WordHighlightingComponent;
    } else if (type === QuestionTypeEnum.Sort) {
      uniqueComponent = SortComponent;
    } else {
      history.push(`/build/brick/${brickId}/build/investigation/question`);
      return <div>...Loading...</div>
    }
    return <SwitchQuestionComponent
      type={component.type}
      index={index}
      swapComponents={swapComponents}
      component={component}
      updateComponent={updatingComponent}
      hint={question.hint}
      setQuestionHint={setQuestionHint}
      uniqueComponent={uniqueComponent} />
  }

  const addQuestionComponent = () => {
    // update question
    addComponent();
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
      <Grid container direction="row" className="add-dropbox">
        <Button className="add-dropbox-button" onClick={addQuestionComponent}>
          + Question Component
        </Button>
      </Grid>
    </div>
  );
}

export default QuestionComponents;
