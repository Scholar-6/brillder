import React from 'react'
import * as Y from "yjs";
import { Grid } from '@material-ui/core';

import './horizontalShuffleBuild.scss'
import { QuestionValueType, UniqueComponentProps } from '../../types';
import { generateId, showSameAnswerPopup } from '../../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import QuestionImageDropzone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import RemoveItemButton from '../../components/RemoveItemButton';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';

export const getDefaultHorizontalShuffleAnswer = (ymap: Y.Map<any>) => {
  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), id: generateId() }));

  const list = new Y.Array();
  list.push([newAnswer(), newAnswer(), newAnswer()]);

  ymap.set("list", list);
}

const HorizontalShuffleBuildComponent: React.FC<UniqueComponentProps> = ({
  locked, data, validationRequired, openSameAnswerDialog
}) => {
  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), id: generateId() }));

  let list = data.get("list") as Y.Array<any>;

  const addAnswer = () => {
    if (locked) { return; }
    list.push([newAnswer()]);
  }

  if (!list) {
    getDefaultHorizontalShuffleAnswer(data);
    list = data.get("list");
  } else if (list.length < 3) {
    addAnswer();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    list.delete(index);
  }

  const renderAnswer = (answer: any, i: number) => {
    let column = (i % 3) + 1;

    const setImage = (fileName: string) => {
      if (locked) { return; }
      answer.set("value", "");
      answer.set("valueFile", fileName);
      answer.set("answerType", QuestionValueType.Image);
    }

    let className = `horizontal-shuffle-box unique-component horizontal-column-${column}`;
    if (answer.get("answerType") === QuestionValueType.Image) {
      className += ' big-answer';
    }

    let isValid = null;
    if (validationRequired) {
      isValid = true;
      if (answer.get("answerType") === QuestionValueType.String && !answer.get("value")) {
        isValid = false;
      }
    }

    if (isValid === false) {
      className += ' invalid-answer';
    }

    return (
      <Grid container item xs={4} key={answer.get("id")}>
        <div className={className}>
          <RemoveItemButton index={i} length={list.length} onClick={removeFromList} />
          <QuestionImageDropzone
            answer={answer as any}
            type={answer.get("answerType") || QuestionValueType.None}
            locked={locked}
            fileName={answer.get("valueFile")}
            update={setImage}
          />
          <QuillEditor
            disabled={locked}
            sharedData={answer.get("value")}
            validate={validationRequired}
            toolbar={['latex']}
            isValid={isValid}
            placeholder={"Enter A" + (i + 1) + "..."}
            onBlur={() => {
              showSameAnswerPopup(i, list.toJSON(), openSameAnswerDialog);
            }}
          />
        </div>
      </Grid>
    );
  }

  return (
    <div className="horizontal-shuffle-build">
      <div className="component-title">
        Enter Answers in the correct order from left to right.<br/>
        These will be randomised in the Play Interface.
      </div>
      <Grid container direction="row" className="answers-container">
        {
          list.map((answer: any, i: number) => renderAnswer(answer, i))
        }
      </Grid>
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height="auto"
        label="+ ANSWER" />
    </div>
  )
}

export default HorizontalShuffleBuildComponent
