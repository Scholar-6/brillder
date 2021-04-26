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
import { HintState } from 'components/build/baseComponents/Hint/Hint';
import { getNonEmptyComponent } from "../../questionService/ValidateQuestionService";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import FixedTextComponent from "../components/Text/FixedText";
import { TextComponentObj } from "../components/Text/interface";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import DeleteDialog from "components/build/baseComponents/dialogs/DeleteDialog";
import { QuillEditorContext } from "components/baseComponents/quill/QuillEditorContext";
import QuillGlobalToolbar from "components/baseComponents/quill/QuillGlobalToolbar";


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

  // phone preview
  componentFocus(index: number): void;
}

const QuestionComponents = ({
  questionIndex, locked, editOnly, history, brickId, question, validationRequired,
  componentFocus, updateComponents, setQuestionHint, saveBrick, updateFirstComponent
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
  const editorIdState = React.useState("");

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
    if(components[componentIndex].type !== QuestionComponentTypeEnum.Component) {
      comps.splice(componentIndex, 1);
      setComponents(comps);
      updateComponents(comps);
      saveBrick();
    }
    setDialog(false);
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
        componentFocus={() => componentFocus(index)}
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
      <QuillEditorContext.Provider value={editorIdState}>
        <QuillGlobalToolbar
          disabled={locked}
          availableOptions={[
            'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
            'latex', 'bulletedList', 'numberedList', 'blockQuote', 'image'
          ]}
        />
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
        <DeleteDialog
          isOpen={dialogOpen}
          title="Permanently delete<br />this component?"
          index={removeIndex}
          submit={removeInnerComponent}
          close={hideDialog}
        />
        <ValidationFailedDialog
          isOpen={sameAnswerDialogOpen}
          header="Looks like some answers are the same."
          label="Correct answers could be marked wrong. Please make sure all answers are different."
          close={hideSameAnswerDialog}
        />
      </QuillEditorContext.Provider>
    </div>
  );
}

export default QuestionComponents;
