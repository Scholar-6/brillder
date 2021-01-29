import React, { useEffect } from 'react';
import * as Y from "yjs";

import './verticalShuffleBuild.scss'
import { QuestionValueType, UniqueComponentProps } from '../../types';
import { showSameAnswerPopup } from '../../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import QuestionImageDropzone from 'components/build/baseComponents/questionImageDropzone/QuestionImageDropzone';
import RemoveItemButton from '../../components/RemoveItemButton';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


export interface VerticalShuffleBuildProps extends UniqueComponentProps { }

export const getDefaultVerticalShuffleAnswer = () => {
  const newAnswer = () => ({ value: new Y.Text(), id: Math.floor(Math.random() * 256) });
  const list = new Y.Array();
  list.push([newAnswer(), newAnswer(), newAnswer()]);

  return new Y.Map(Object.entries({ list }));
}

const VerticalShuffleBuildComponent: React.FC<VerticalShuffleBuildProps> = ({
  locked, editOnly, data, validationRequired, openSameAnswerDialog
}) => {
  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), id: Math.floor(Math.random() * 256) }));

  let list = data.get("list") as Y.Array<any>;

  const addAnswer = () => {
    if (locked) { return; }
    list.push([newAnswer()]);
  }

  if (!list) {
    data.set("list", getDefaultVerticalShuffleAnswer().get("list"));
    list = data.get("list");
  } else if (list.length < 3) {
    addAnswer();
  }

  const changed = (answer: any, value: string) => {
    if (locked) { return; }
    answer.value = value;
    answer.valueFile = "";
    answer.answerType = QuestionValueType.String;
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    list.delete(index);
  }

  const renderAnswer = (answer: any, i: number) => {
    const setImage = (fileName: string) => {
      if (locked) { return; }
      answer.value = "";
      answer.valueFile = fileName;
      answer.answerType = QuestionValueType.Image;
    }

    let className = 'vertical-answer-box unique-component';
    if (answer.answerType === QuestionValueType.Image) {
      className += ' big-answer';
    }

    let isValid = null;
    if (validationRequired) {
      isValid = true;
      if ((answer.answerType === QuestionValueType.String || answer.answerType === QuestionValueType.None) && !answer.value) {
        isValid = false;
      }
    }

    if (isValid === false) {
      className += ' invalid-answer';
    }

    console.log(answer);

    return (
      <div className={className} key={answer.get("id")}>
        <RemoveItemButton index={i} length={list.length} onClick={removeFromList} />
        <QuestionImageDropzone
          answer={answer as any}
          type={answer.answerType || QuestionValueType.None}
          locked={locked}
          fileName={answer.valueFile}
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

export default VerticalShuffleBuildComponent
