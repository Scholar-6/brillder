import React, { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { Grid, Button } from '@material-ui/core';

import './questionComponents.scss';
import ShortAnswerComponent from '../questionTypes/shortAnswerBuild/shortAnswerBuild';
import SwitchQuestionComponent from '../components/QuestionComponentSwitcher';
import CategoriseComponent from '../questionTypes/categoriseBuild/categoriseBuild';
import ChooseOneComponent from '../questionTypes/chooseOneBuild/chooseOneBuild';
import ChooseSeveralComponent from '../questionTypes/chooseSeveralBuild/chooseSeveralBuild';
import HorizontalShuffleComponent from '../questionTypes/horizontalShuffleBuild/horizontalShuffleBuild';
import LineHighlightingComponent from '../questionTypes/lineHighlightingBuild/LineHighlightingBuild';
import MissingWordComponent from '../questionTypes/missingWordBuild/MissingWordBuild';
import PairMatchComponent from '../questionTypes/pairMatchBuild/pairMatchBuild';
import VerticalShuffleComponent from '../questionTypes/verticalShuffleBuild/verticalShuffleBuild';
import WordHighlightingComponent from '../questionTypes/wordHighlighting/wordHighlighting';
import { Question, QuestionTypeEnum } from 'components/model/question';
import { HintState } from 'components/build/baseComponents/Hint/Hint';


type QuestionComponentsProps = {
  questionIndex: number
  locked: boolean
  history: any
  brickId: number
  question: Question
  updateComponents(components: any[]): void
  setQuestionHint(hintState: HintState): void
}

const QuestionComponents = ({
  questionIndex, locked, history, brickId, question, updateComponents, setQuestionHint
}: QuestionComponentsProps) => {
  let componentsCopy = Object.assign([], question.components) as any[]
  const [questionId, setQuestionId] = useState(question.id);
  const [components, setComponents] = useState(componentsCopy);

  if (questionId !== question.id) {
    setQuestionId(question.id);
    let compsCopy = Object.assign([], question.components);
    setComponents(compsCopy);
  }

  const removeInnerComponent = (componentIndex:number) => {
    if (locked) { return; }
    const comps = Object.assign([], components) as any[];
    comps.splice(componentIndex, 1);
    setComponents(comps);
    updateComponents(comps);
  }

  const addInnerComponent = () => {
    if (locked) { return; }
    const comps = Object.assign([], components) as any[];
    comps.push({type: 0});
    setComponents(comps);
    updateComponents(comps);
  }

  let canRemove = (components.length > 3) ? true : false;

  const renderDropBox = (component: any, index: number) => {
    const updatingComponent = (compData: any) => {
      let copyComponents = Object.assign([], components) as any[];
      copyComponents[index] = compData;
      setComponents(copyComponents);
      updateComponents(copyComponents);
    }

    const { type } = question;
    let uniqueComponent: any;
    if (type === QuestionTypeEnum.ShortAnswer) {
      uniqueComponent = ShortAnswerComponent;
    } else if (type === QuestionTypeEnum.Sort) {
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
      questionIndex={questionIndex}
      index={index}
      locked={locked}
      component={component}
      updateComponent={updatingComponent}
      hint={question.hint}
      canRemove={canRemove}
      removeComponent={removeInnerComponent}
      setQuestionHint={setQuestionHint}
      uniqueComponent={uniqueComponent} />
  }

  const setList = (components: any) => {
    if (locked) { return; }
    setComponents(components);
    updateComponents(components);
  }

  return (
    <div className="questions">
      <ReactSortable
        list={components}
        animation={150}
        group={{ name: "cloning-group-name", pull: "clone" }}
        setList={setList}>
        {
          components.map((comp, i) => (
            <Grid key={i} container direction="row" className="drop-box">
              {renderDropBox(comp, i)}
            </Grid>
          ))
        }
      </ReactSortable>
      <Grid container direction="row" className="add-dropbox">
        <Button disabled={locked} className="add-dropbox-button" onClick={addInnerComponent}>
          + &nbsp;&nbsp; Q &nbsp; U &nbsp; E &nbsp; S &nbsp; T &nbsp; I &nbsp; O &nbsp; N &nbsp; &nbsp; C &nbsp; O &nbsp; M &nbsp; P &nbsp; O &nbsp; N &nbsp; E &nbsp; N &nbsp; T
        </Button>
      </Grid>
    </div>
  );
}

export default QuestionComponents;
