import React, { useState } from "react";
import { ReactSortable, Sortable } from "react-sortablejs";
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
import { QuestionTypeEnum, QuestionComponentTypeEnum } from 'model/question';
import { getNonEmptyComponent } from "../../questionService/ValidateQuestionService";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import FixedTextComponent from "../components/Text/FixedText";
import * as Y from "yjs";
import { generateId } from "../questionTypes/service/questionBuild";
import QuillGlobalToolbar from "components/baseComponents/quill/QuillGlobalToolbar";
import { QuillEditorContext } from "components/baseComponents/quill/QuillEditorContext";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import DeleteDialog from "components/build/baseComponents/dialogs/DeleteDialog";


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
  const editorIdState = useState("");

  const questionData = question.getMap();
  const questionId = questionData.get("id");

  // WARNING: very hacky solution!
  // Unfortunately react-sortablejs has some weird behaviour when interacting with YJS.
  // My solution is to generate a unique ID for the sortable everytime two components are swapped.
  // This forces a re-render of that component so that it retains the correct ordering, rather than swapping them back.
  const [sortableId, setSortableId] = React.useState(generateId());
  
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
    if(!component) return;

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

  // Use more atomic method (02/02/2021)
  // const setList = (newComponents: any) => {
  //   if (locked) { return; }
  //   // create a new doc and sync it with this one.
  //   const newDoc = new Y.Doc();
  //   const oldUpdate = Y.encodeStateAsUpdate(question);
  //   Y.applyUpdate(newDoc, oldUpdate);

  //   const newComponentsArray = new Y.Array();
  //   newComponentsArray.push(newComponents.map(convertObject));
  //   newDoc.getMap().set("questions", newComponentsArray);
  //   console.log(newDoc.toJSON());

  //   const newState = Y.encodeStateVector(newDoc);
  //   const newUpdate = Y.encodeStateAsUpdate(question, newState);
  //   Y.applyUpdate(question, newUpdate);
  // }

  const createNewComponent = (type: QuestionComponentTypeEnum) => {
    switch(type) {
      case QuestionComponentTypeEnum.Text:
        return new Y.Map(Object.entries({ chosen: false, selected: false, type: QuestionComponentTypeEnum.Text, value: new Y.Text(), id: generateId() }));
      case QuestionComponentTypeEnum.Quote:
        return new Y.Map(Object.entries({ chosen: false, selected: false, type: QuestionComponentTypeEnum.Quote, value: new Y.Text(), id: generateId() }));
      case QuestionComponentTypeEnum.Image:
        return new Y.Map(Object.entries({ chosen: false, selected: false, type: QuestionComponentTypeEnum.Image, value: '', id: generateId() }));
      case QuestionComponentTypeEnum.Sound:
        return new Y.Map(Object.entries({ chosen: false, selected: false, type: QuestionComponentTypeEnum.Sound, value: '', id: generateId() }));
      case QuestionComponentTypeEnum.Graph:
       return new Y.Map(Object.entries({ chosen: false, selected: false, type: QuestionComponentTypeEnum.Graph, value: new Y.Map(Object.entries({
          graphSettings: new Y.Map(Object.entries({
            showSidebar: false,
            showSettings: false,
            allowPanning: false,
            trace: false,
            pointsOfInterest: false,
          })),
          graphState: undefined,
       })), id: generateId() }));
    }
  }

  const onAddComponent = (evt: Sortable.SortableEvent) => {
    if(evt.item.dataset.value && (evt.newIndex !== undefined)) {
      const newComponent = createNewComponent(parseInt(evt.item.dataset.value))
      if(newComponent) {
        components.insert(evt.newIndex, [newComponent]);
      }
    }
  }

  const onUpdateComponent = (evt: Sortable.SortableEvent) => {
    if(((evt.oldIndex ?? -1) >= 0) && ((evt.newIndex ?? -1) >= 0)) {
      console.log(evt);
      components.doc?.transact(() => {
        const component = components.get(evt.oldIndex!).clone() as Y.Map<any>;
        components.delete(evt.oldIndex!);
        components.insert(evt.newIndex!, [component]);
      });
      setSortableId(generateId());
    }
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
  <QuillEditorContext.Provider value={editorIdState}>
    <div className="questions">
      <QuillGlobalToolbar
        availableOptions={[
          'bold', 'italic', 'fontColor', 'superscript', 'subscript', 'strikethrough',
          'latex', 'bulletedList', 'numberedList', 'blockQuote', 'image'
        ]}
      />
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
        key={sortableId}
        list={components.toJSON()}
        animation={150}
        group={{ name: "cloning-group-name", pull: "clone" }}
        onAdd={onAddComponent}
        onUpdate={onUpdateComponent}
        setList={() => {}}
      >
        {
          components.toJSON().map((comp: any, i: number) => (
            <Grid key={i} container direction="row" className={validateDropBox(comp)}>
              {renderDropBox(components.get(i), i)}
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
    </div>
  </QuillEditorContext.Provider>
  );
}

export default QuestionComponents;
