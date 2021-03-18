import React from 'react';
import * as Y from "yjs";
import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';

import './chooseSeveralBuild.scss';
import ChooseOneAnswerComponent from '../chooseOneBuild/ChooseOneAnswer';
import {ChooseOneAnswer} from '../chooseOneBuild/types';
import validator from '../../../questionService/UniqueValidator';
import { generateId, showSameAnswerPopup } from '../service/questionBuild';

export interface ChooseSeveralData {
  list: ChooseOneAnswer[];
}

export interface ChooseSeveralBuildProps {
  locked: boolean;
  editOnly: boolean;
  data: Y.Map<any>;
  validationRequired: boolean;
  openSameAnswerDialog(): void;
}

export const getDefaultChooseSeveralAnswer = (ymap: Y.Map<any>) => {
  const newAnswer = () => new Y.Map(Object.entries({value: new Y.Text(), checked: false, valueFile: '', imageSource: "", imageCaption: "", id: generateId() }));

  const list = new Y.Array();
  list.push([newAnswer(), newAnswer(), newAnswer()]);

  ymap.set("list", list);
  return ymap;
}

const ChooseSeveralBuildComponent: React.FC<ChooseSeveralBuildProps> = ({
  locked, editOnly, data, validationRequired, openSameAnswerDialog
}) => {
  const newAnswer = () => new Y.Map(Object.entries({value: new Y.Text(), checked: false, valueFile: '', imageSource: "", imageCaption: "", id: generateId() }));

  let list = data.get("list") as Y.Array<any>;

  if (!list) {
    getDefaultChooseSeveralAnswer(data);
    list = data.get("list");
  } else if (list.length < 3) {
    list.push([newAnswer()]);
  }

  const addAnswer = () => {
    if (locked) { return; }
    list.push([newAnswer()]);
  }

  const onChecked = (event:React.ChangeEvent<HTMLInputElement>) => {
    if (locked) { return; }
    const index = parseInt(event.target.value);
    list.get(index).set("checked", event.target.checked);
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    list.delete(index);
  }

  let isChecked = !!validator.validateChooseSeveralChecked(list.toJSON());

  return (
    <div className="choose-several-build unique-component">
      <div className="component-title unselectable">Tick Correct Answers</div>
      {
        list.map((answer:any, i:number) => {
          return <ChooseOneAnswerComponent
            locked={locked}
            editOnly={editOnly}
            key={answer.get("id")}
            index={i}
            length={list.length}
            answer={answer}
            checkBoxValid={isChecked}
            validationRequired={validationRequired}
            removeFromList={removeFromList}
            onChecked={onChecked}
            onBlur={() => showSameAnswerPopup(i, list.toJSON(), openSameAnswerDialog)}
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

export default ChooseSeveralBuildComponent
