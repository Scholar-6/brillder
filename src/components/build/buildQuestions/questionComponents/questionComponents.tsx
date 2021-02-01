import React, { useState, useEffect } from "react";
import { ReactSortable } from "react-sortablejs";
import { Grid } from '@material-ui/core';

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
import { getNonEmptyComponent } from "../../questionService/ValidateQuestionService";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import FixedTextComponent from "../components/Text/FixedText";
import { TextComponentObj } from "../components/Text/interface";
import * as Y from "yjs";
import _ from "lodash";
import { convertObject } from "services/SharedTypeService";
import DeleteComponentDialog from "./deleteComponentDialog";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";


type QuestionComponentsProps = {
  questionIndex: number;
  locked: boolean;
  editOnly: boolean;
  history: any;
  brickId: number;
  question: Y.Doc;
  validationRequired: boolean;

  // phone preview
  componentFocus(index: number): void;
}

const QuestionComponents = ({
  questionIndex, locked, editOnly, history, brickId, question, validationRequired,
  componentFocus
}: QuestionComponentsProps) => {

  const [removeIndex, setRemovedIndex] = useState(-1);
  const [dialogOpen, setDialog] = useState(false);
  const [sameAnswerDialogOpen, setSameAnswerDialog] = useState(false);

  const questionData = question.getMap();
  const questionId = questionData.get("id");
  
  let firstComponent = questionData.get("firstComponent") as Y.Map<any>;
  if (!firstComponent.get("type") || firstComponent.get("type") !== QuestionComponentTypeEnum.Text) {
    firstComponent.set("type", QuestionComponentTypeEnum.Text);
    firstComponent.set("value", '');
  }

  const hideSameAnswerDialog = () => setSameAnswerDialog(false);
  const openSameAnswerDialog = () => setSameAnswerDialog(true);

  const components = questionData.get("components") as Y.Array<Y.Map<any>>;

  const removeInnerComponent = (componentIndex: number) => {
    if (locked) { return; }
    components.delete(componentIndex);
  }

  let canRemove = (components.length > 3) ? true : false;

  const renderDropBox = (component: Y.Map<any>, index: number) => {
    const updatingComponent = (compData: any) => {
      let copyComponents = Object.assign([], components) as any[];
      copyComponents[index] = compData;

      components.doc!.transact(() => {
        components.delete(index);
        components.insert(index, [convertObject(compData)]);
      })
    }

    const setEmptyType = () => {
      if (component.get("value")) {
        setDialog(true);
        setRemovedIndex(index);
      } else {
        removeInnerComponent(index);
      }
    }

    const type = questionData.get("type");
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
        questionType={type}
        type={component.get("type")}
        questionIndex={questionIndex}
        index={index}
        locked={locked}
        editOnly={editOnly}
        component={component}
        hint={questionData.get("hint")}
        canRemove={canRemove}
        uniqueComponent={uniqueComponent}
        allDropBoxesEmpty={allDropBoxesEmpty}
        validationRequired={validationRequired}
        componentFocus={() => componentFocus(index)}
        setEmptyType={setEmptyType}
        removeComponent={removeInnerComponent}
        openSameAnswerDialog={openSameAnswerDialog}
      />
    );
  }

  const setList = (newComponents: any) => {
    if (locked) { return; }
    // create a new doc and sync it with this one.
    const newDoc = new Y.Doc();
    const oldUpdate = Y.encodeStateAsUpdate(question);
    Y.applyUpdate(newDoc, oldUpdate);

    const newComponentsArray = new Y.Array();
    newComponentsArray.push(newComponents);
    newDoc.getMap().set("questions", newComponentsArray);

    const newState = Y.encodeStateVector(newDoc);
    const newUpdate = Y.encodeStateAsUpdate(question, newState);
    Y.applyUpdate(question, newUpdate);
  }

  const hideDialog = () => {
    setDialog(false);
    setRemovedIndex(-1);
  }

  let allDropBoxesEmpty = false;
  let noComponent = getNonEmptyComponent(components.toJSON());
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
          questionId={questionId}
          data={firstComponent}
          validationRequired={validationRequired}
        />
      </Grid>
      <ReactSortable
        list={components.toJSON()}
        animation={150}
        group={{ name: "cloning-group-name", pull: "clone" }}
        setList={setList}
      >
        {
          components.map((comp: Y.Map<any>, i) => (
            <Grid key={`${questionId}-${i}`} container direction="row" className={validateDropBox(comp)}>
              {renderDropBox(comp, i)}
            </Grid>
          ))
        }
      </ReactSortable>
      <DeleteComponentDialog isOpen={dialogOpen} removeIndex={removeIndex} submit={removeInnerComponent} close={hideDialog} />
      <ValidationFailedDialog
        isOpen={sameAnswerDialogOpen}
        header="Looks like some answers are the same."
        label="Correct answers could be marked wrong. Please make sure all answers are different."
        close={hideSameAnswerDialog}
      />
    </div>
  );
}

export default QuestionComponents;
