import React, { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { Grid } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';

import './questionComponents.scss';
import ShortAnswerComponent from '../questionTypes/shortAnswerBuild/shortAnswerBuild';
import SwitchQuestionComponent from '../components/QuestionComponentSwitcher';
import CategoriseComponent from '../questionTypes/categoriseBuild/categoriseBuild';
import ChooseOneComponent from '../questionTypes/chooseOneBuild/chooseOneBuild';
import ChooseSeveralComponent from '../questionTypes/chooseSeveralBuild/chooseSeveralBuild';
import HorizontalShuffleComponent from '../questionTypes/shuffle/horizontalShuffleBuild/horizontalShuffleBuild';
import LineHighlightingComponent from '../questionTypes/highlighting/lineHighlightingBuild/LineHighlightingBuild';
import MissingWordComponent from '../questionTypes/missingWordBuild/MissingWordBuild';
import PairMatchComponent from '../questionTypes/pairMatchBuild/pairMatchBuild';
import VerticalShuffleComponent from '../questionTypes/shuffle/verticalShuffleBuild/verticalShuffleBuild';
import WordHighlightingComponent from '../questionTypes/highlighting/wordHighlighting/wordHighlighting';
import { Question, QuestionTypeEnum, QuestionComponentTypeEnum } from 'model/question';
import { HintState } from 'components/build/baseComponents/Hint/Hint';
import { getNonEmptyComponent } from "../../questionService/ValidateQuestionService";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import FixedTextComponent from "../components/Text/FixedText";
import { TextComponentObj } from "../components/Text/interface";


type QuestionComponentsProps = {
  questionIndex: number;
  locked: boolean;
  editOnly: boolean;
  history: any;
  brickId: number;
  question: Question;
  validationRequired: boolean;
  saveBrick(): void;
  updateFirstComponent(component: TextComponentObj): void;
  updateComponents(components: any[]): void;
  setQuestionHint(hintState: HintState): void;
}

const QuestionComponents = ({
  questionIndex, locked, editOnly, history, brickId, question, validationRequired,
  updateComponents, setQuestionHint, saveBrick, updateFirstComponent
}: QuestionComponentsProps) => {
  
  let firstComponent = Object.assign({}, question.firstComponent) as any;
  if (!firstComponent.type || firstComponent.type !== QuestionComponentTypeEnum.Text) {
    firstComponent = {
      type: QuestionComponentTypeEnum.Text,
      value: ''
    };
  }

  const componentsCopy = Object.assign([], question.components) as any[]
  const [components, setComponents] = useState(componentsCopy);
  const [questionId, setQuestionId] = useState(question.id);
  const [removeIndex, setRemovedIndex] = useState(-1);
  const [dialogOpen, setDialog] = useState(false);
  const [sameAnswerDialogOpen, setSameAnswerDialog] = useState(false);

  useEffect(() => {
    setComponents(Object.assign([], question.components) as any[]);
  }, [question]);

  if (questionId !== question.id) {
    setQuestionId(question.id);
    setComponents(Object.assign([], question.components));
  }

  const hideSameAnswerDialog = () => setSameAnswerDialog(false);
  const openSameAnswerDialog = () => setSameAnswerDialog(true);

  const removeInnerComponent = (componentIndex: number) => {
    if (locked) { return; }
    const comps = Object.assign([], components) as any[];
    comps.splice(componentIndex, 1);
    setComponents(comps);
    updateComponents(comps);
    saveBrick();
  }

  let canRemove = (components.length > 3) ? true : false;

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
        removeInnerComponent(index);
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
      history.push(`/build/brick/${brickId}/investigation/question`);
      return <PageLoader content="...Loading..." />;
    }

    return (
      <SwitchQuestionComponent
        questionType={question.type}
        type={component.type}
        questionIndex={questionIndex}
        index={index}
        locked={locked}
        editOnly={editOnly}
        component={component}
        hint={question.hint}
        canRemove={canRemove}
        uniqueComponent={uniqueComponent}
        allDropBoxesEmpty={allDropBoxesEmpty}
        validationRequired={validationRequired}
        setEmptyType={setEmptyType}
        removeComponent={removeInnerComponent}
        setQuestionHint={setQuestionHint}
        updateComponent={updatingComponent}
        saveBrick={saveBrick}
        openSameAnswerDialog={openSameAnswerDialog}
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

  let allDropBoxesEmpty = false;
  let noComponent = getNonEmptyComponent(components);
  if (noComponent) {
    allDropBoxesEmpty = true;
  }

  const validateDropBox = (comp: any) => {
    let name = "drop-box";
    if (validationRequired && comp.type === QuestionComponentTypeEnum.None && allDropBoxesEmpty) {
      name += " invalid";
    }
    return name;
  }

  return (
    <div className="questions">
      <Grid container direction="row" className={validateDropBox(firstComponent)}>
        <FixedTextComponent
          locked={locked}
          editOnly={editOnly}
          questionId={question.id}
          data={firstComponent}
          save={saveBrick}
          validationRequired={validationRequired}
          updateComponent={updateFirstComponent}
        />
      </Grid>
      <ReactSortable
        list={components}
        animation={150}
        group={{ name: "cloning-group-name", pull: "clone" }}
        setList={setList}
      >
        {
          components.map((comp, i) => (
            <Grid key={`${questionId}-${i}`} container direction="row" className={validateDropBox(comp)}>
              {renderDropBox(comp, i)}
            </Grid>
          ))
        }
      </ReactSortable>
      <Dialog open={dialogOpen} onClose={hideDialog} className="dialog-box">
        <div className="dialog-header">
          <div>Permanently delete<br />this component?</div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button"
            onClick={() => {
              removeInnerComponent(removeIndex);
              hideDialog();
            }}>
            <span>Yes, delete</span>
          </button>
          <button className="btn btn-md bg-gray no-button"
            onClick={hideDialog}>
            <span>No, keep</span>
          </button>
        </div>
      </Dialog>
      <Dialog open={sameAnswerDialogOpen} className="dialog-box" onClose={hideSameAnswerDialog}>
        <div className="dialog-header">
          <div>Looks like these two answers are the same</div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-gray yes-button" onClick={hideSameAnswerDialog}>
            <span>Ok</span>
          </button>
        </div>
      </Dialog>
    </div>
  );
}

export default QuestionComponents;
