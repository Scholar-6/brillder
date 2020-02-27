import React from 'react';
import { Grid, Button } from '@material-ui/core';

import './questionComponents.scss';
import ShortAnswerComponent from '../questionTypes/shortAnswerBuild/shortAnswerBuild';
import SwitchQuestionComponent from '../components/QuestionComponentSwitcher';
import CategoriseComponent from '../questionTypes/categoriseBuild/categoriseBuild';
import ChooseOneComponent from '../questionTypes/chooseOneBuild/chooseOneBuild';
import ChooseSeveralComponent from '../questionTypes/chooseSeveralBuild/chooseSeveralBuild';
import HorizontalShuffleComponent from '../questionTypes/horizontalShuffleBuild/horizontalShuffleBuild';
import LineHighlightingComponent from '../questionTypes/lineHighlightingBuild/LineHighlightingBuild';
import MissingWordComponent from '../questionTypes/missingWordBuild';
import PairMatchComponent from '../questionTypes/pairMatchBuild/pairMatchBuild';
import VerticalShuffleComponent from '../questionTypes/verticalShuffleBuild/verticalShuffleBuild';
import WordHighlightingComponent from '../questionTypes/wordHighlighting/wordHighlighting';
import { Question, QuestionTypeEnum } from 'components/model/question';
import { HintState } from 'components/build/baseComponents/Hint/Hint';


type QuestionComponentsProps = {
  locked: boolean
  history: any
  brickId: number
  question: Question
  swapComponents: Function
  addComponent(): void
  updateComponent(component: any, index: number):void
  setQuestionHint(hintState: HintState): void
}

const QuestionComponents = ({ locked, history, brickId, question, swapComponents, setQuestionHint, updateComponent, addComponent }: QuestionComponentsProps) => {
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
    } else {
      history.push(`/build/brick/${brickId}/build/investigation/question`);
      return <div>...Loading...</div>
    }
    return <SwitchQuestionComponent
      type={component.type}
      index={index}
      locked={locked}
      swapComponents={swapComponents}
      component={component}
      updateComponent={updatingComponent}
      hint={question.hint}
      setQuestionHint={setQuestionHint}
      uniqueComponent={uniqueComponent} />
  }

  const addQuestionComponent = () => {
    addComponent();
  }

  return (
    <div className="questions">
      {
        question.components.map((comp, i) => {
          return (
            <Grid key={i} container direction="row" className="drop-box">
              {renderDropBox(comp, i)}
            </Grid>
          )
        })
      }
      <Grid container direction="row" className="add-dropbox">
        <Button disabled={locked} className="add-dropbox-button" onClick={addQuestionComponent}>
          + &nbsp;&nbsp; Q &nbsp; U &nbsp; E &nbsp; S &nbsp; T &nbsp; I &nbsp; O &nbsp; N &nbsp; &nbsp; C &nbsp; O &nbsp; M &nbsp; P &nbsp; O &nbsp; N &nbsp; E &nbsp; N &nbsp; T
        </Button>
      </Grid>
    </div>
  );
}

export default QuestionComponents;
