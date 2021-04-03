import React from 'react';
import * as Y from "yjs";

import './verticalShuffleBuild.scss'
import { QuestionValueType, UniqueComponentProps } from '../../types';
import { generateId, showSameAnswerPopup } from '../../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import QuestionImageDropzone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import RemoveItemButton from '../../components/RemoveItemButton';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


export interface VerticalShuffleBuildProps extends UniqueComponentProps { }

export const getDefaultVerticalShuffleAnswer = (ymap: Y.Map<any>) => {
  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), valueFile: "", imageSource: "", imageCaption: "", id: generateId() }));

  const list = new Y.Array();
  list.push([newAnswer(), newAnswer(), newAnswer()]);

  ymap.set("list", list);
}

const VerticalShuffleBuildComponent: React.FC<VerticalShuffleBuildProps> = ({
  locked, editOnly, data, validationRequired, openSameAnswerDialog
}) => {
  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), valueFile: "", imageSource: "", imageCaption: "", id: generateId() }));

  let list = data.get("list") as Y.Array<any>;

  const addAnswer = () => {
    if (locked) { return; }
    list.push([newAnswer()]);
  }

  if (!list) {
    getDefaultVerticalShuffleAnswer(data);
    list = data.get("list");
  } else if (list.length < 3) {
    addAnswer();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    list.delete(index);
  }

  const renderAnswer = (answer: any, i: number) => {
    console.log(answer);
    const setImage = (fileName: string, source: string, caption: string) => {
      if (locked) { return; }
      answer.set("value", "");
      answer.set("valueFile", fileName);
      answer.set("imageSource", source);
      answer.set("imageCaption", caption);
      answer.set("answerType", QuestionValueType.Image);
    }

    let className = 'vertical-answer-box unique-component';
    if (answer.get("answerType") === QuestionValueType.Image) {
      className += ' big-answer';
    }

    let isValid = null;
    if (validationRequired) {
      isValid = true;
      if ((answer.get("answerType") === QuestionValueType.String || answer.get("answerType") === QuestionValueType.None) && !answer.get("value")) {
        isValid = false;
      }
    }

    if (isValid === false) {
      className += ' invalid-answer';
    }

    return (
      <div className={className} key={answer.get("id")}>
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
          placeholder={"Enter Answer " + (i + 1) + "..."}
          onBlur={() => {
            showSameAnswerPopup(i, list.toJSON(), openSameAnswerDialog);
          }}
        />
      </div>
    );
  }

  return (
    <div className="vertical-shuffle-build unique-component">
      <div className="component-title">
        Enter Answers in the correct order from top to bottom.<br/>
        These will be randomised in the Play Interface.
      </div>
      {
        list.map((answer: any, i: number) => renderAnswer(answer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height="auto"
        label="+ ANSWER" />
    </div>
  )
}

export default React.memo(VerticalShuffleBuildComponent);
