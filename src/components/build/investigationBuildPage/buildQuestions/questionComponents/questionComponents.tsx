import React, { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { Grid, Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';

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
import { Question, QuestionTypeEnum, QuestionComponentTypeEnum } from 'model/question';
import { HintState } from 'components/build/baseComponents/Hint/Hint';


type QuestionComponentsProps = {
  questionIndex: number;
  locked: boolean;
  history: any;
  brickId: number;
  question: Question;
  validationRequired: boolean;
  saveBrick(): void;
  updateComponents(components: any[]): void;
  setQuestionHint(hintState: HintState): void;
}

const QuestionComponents = ({
  questionIndex, locked, history, brickId, question, validationRequired,
  updateComponents, setQuestionHint, saveBrick
}: QuestionComponentsProps) => {
  let componentsCopy = Object.assign([], question.components) as any[]
  const [questionId, setQuestionId] = useState(question.id);
  const [components, setComponents] = useState(componentsCopy);
  const [removeIndex, setRemovedIndex] = useState(-1);
  const [dialogOpen, setDialog] = useState(false);

  useEffect(() => {
    let componentsCopy = Object.assign([], question.components) as any[];
    setComponents(componentsCopy);
  }, [question]);

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
    console.log('delete');
    saveBrick();
  }

  const addInnerComponent = () => {
    if (locked) { return; }
    const comps = Object.assign([], components) as any[];
    comps.push({type: 0});
    setComponents(comps);
    updateComponents(comps);
    saveBrick();
  }

  let canRemove = (components.length > 3) ? true : false;

  const updateComponentByIndex = (compData: any, index:number) => {
    let copyComponents = Object.assign([], components) as any[];
    copyComponents[index] = compData;
    setComponents(copyComponents);
    updateComponents(copyComponents);
  }

  const removeComponentType = () => {
    const component = components[removeIndex];
    component.type = QuestionTypeEnum.None;
    component.value = "";
    updateComponentByIndex(component, removeIndex);
    setDialog(false);
    setRemovedIndex(-1);
  }

  const renderDropBox = (component: any, index: number) => {
    const updatingComponent = (compData: any) => {
      let copyComponents = Object.assign([], components) as any[];
      copyComponents[index] = compData;
      setComponents(copyComponents);
      updateComponents(copyComponents);
    }

    const setEmptyType = () => {
      if (component.value) {
        setDialog(true);
        setRemovedIndex(index);
      } else {
        component.type = QuestionTypeEnum.None;
        component.value = "";
        updatingComponent(component);
      }
      saveBrick();
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

    return (
      <SwitchQuestionComponent
        type={component.type}
        questionIndex={questionIndex}
        index={index}
        locked={locked}
        component={component}
        hint={question.hint}
        canRemove={canRemove}
        uniqueComponent={uniqueComponent}
        validationRequired={validationRequired}
        setEmptyType={setEmptyType}
        removeComponent={removeInnerComponent}
        setQuestionHint={setQuestionHint}
        updateComponent={updatingComponent}
        saveBrick={saveBrick}
      />
    );
  }

  const setList = (components: any) => {
    if (locked) { return; }
    setComponents(components);
    updateComponents(components);
    saveBrick();
  }

  const hideDialog = () => {
    setDialog(false);
    setRemovedIndex(-1);
  }

  const validateDropBox = (comp: any) => {
    let name = "drop-box";
    if (validationRequired && comp.type === QuestionComponentTypeEnum.None) {
      name += " invalid";
    }
    return name;
  }

  return (
    <div className="questions">
      <ReactSortable
        list={components}
        animation={150}
        group={{ name: "cloning-group-name", pull: "clone" }}
        setList={setList}
      >
        {
          components.map((comp, i) => (
            <Grid key={i} container direction="row" className={validateDropBox(comp)}>
              {renderDropBox(comp, i)}
            </Grid>
          ))
        }
      </ReactSortable>
      <Grid container direction="row" className="add-dropbox">
        <Button disabled={locked} className="add-dropbox-button" onClick={addInnerComponent}>
          + QUESTION COMPONENT
        </Button>
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={hideDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="delete-brick-dialog"
      >
        <div className="dialog-header">
          <div>Permanently delete</div>
          <div>this component?</div>
        </div>
        <Grid container direction="row" className="row-buttons" justify="center">
          <Button className="yes-button" onClick={removeComponentType}>Yes, delete</Button>
          <Button className="no-button" onClick={hideDialog}>No, keep</Button>
        </Grid>
      </Dialog>
    </div>
  );
}

export default QuestionComponents;
