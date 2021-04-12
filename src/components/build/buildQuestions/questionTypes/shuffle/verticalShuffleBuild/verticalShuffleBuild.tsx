import React from 'react';
import * as Y from "yjs";

import './verticalShuffleBuild.scss'
import { UniqueComponentProps } from '../../types';
import { generateId, showSameAnswerPopup } from '../../service/questionBuild';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import ObservableAnswer from '../../components/ObservableAnswer';


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

  return (
    <div className="vertical-shuffle-build unique-component">
      <div className="component-title">
        Enter Answers in the correct order from top to bottom.<br/>
        These will be randomised in the Play Interface.
      </div>
      {
        list.map((answer: any, i: number) => {
          return <ObservableAnswer
            locked={locked}
            answer={answer}
            key={i}
            validationRequired={validationRequired}
            index={i} list={list}
            removeFromList={removeFromList}
            checkSameAnswer={() => showSameAnswerPopup(i, list.toJSON(), openSameAnswerDialog)}
          />
        })
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
