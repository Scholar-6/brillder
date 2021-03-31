import React from 'react';
import * as Y from "yjs";

import './chooseOneBuild.scss';
import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import ChooseOneAnswerComponent from './ChooseOneAnswer';
import { ChooseOneAnswer } from './types';
import { UniqueComponentProps } from '../types';
import validator from '../../../questionService/UniqueValidator'
import { generateId, showSameAnswerPopup } from '../service/questionBuild';
import { YJSContext } from 'components/build/baseComponents/YJSProvider';

export interface ChooseOneData {
  list: ChooseOneAnswer[];
}

export interface ChooseOneBuildProps extends UniqueComponentProps {
  data: Y.Map<any>;
}

export const getDefaultChooseOneAnswer = (ymap: Y.Map<any>) => {
  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), checked: false, valueFile: "", imageSource: "", imageCaption: "", id: generateId() }));

  const list = new Y.Array();
  list.push([newAnswer(), newAnswer(), newAnswer()]);

  ymap.set("list", list);
  return ymap;
}

const ChooseOneBuildComponent: React.FC<ChooseOneBuildProps> = ({
  locked, editOnly, data, validationRequired, openSameAnswerDialog
}) => {
  const newAnswer = () => new Y.Map(Object.entries({ value: new Y.Text(), checked: false, valueFile: "", imageSource: "", imageCaption: "", id: generateId() }));

  let list = data.get("list") as Y.Array<any>;

  //#region Awareness
  const { awareness } = React.useContext(YJSContext)!;

  const [hovered, setHovered] = React.useState<any[]>([]);

  const observer = React.useCallback(() => {
    const hovers: any[] = [];
    Array.from(awareness!.getStates().entries()).forEach(([key, value]) => {
      if(key === awareness!.clientID) return;
      if(value.hover && value.hover.type === "unique-component") {
        hovers.push({ user: value.user, index: value.hover.index });
      }
    });
    setHovered(hovers);
  }, [awareness]);

  React.useEffect(() => {
    awareness?.on("update", observer);
    return () => awareness?.off("update", observer);
  }, [awareness]);
  //#endregion

  const addAnswer = () => {
    if (locked) { return; }
    list.push([newAnswer()]);
  }

  if (!list) {
    getDefaultChooseOneAnswer(data);
    list = data.get("list");
  } else if (list.length < 3) {
    addAnswer();
  }

  const onChecked = (event: any) => {
    if (locked) { return; }
    const index = event.target.value;
    list.doc!.transact(() => {
      list.forEach(answer => {
        answer.set("checked", false);
      });
      list.get(index).set("checked", true);
    });
    const state = awareness?.getLocalState();
    if(!state) return;
    state.hover = { index, type: "unique-component" };
    awareness?.setLocalState(state);
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    list.delete(index, 1);
  }

  let checkBoxValid = !!validator.getChecked(list.toJSON());

  return (
    <div className="choose-one-build unique-component">
      <div className="component-title">Tick Correct Answer</div>
      {
        list.map((answer: Y.Map<any>, i: number) => {
          console.log(hovered);
          return <ChooseOneAnswerComponent
            key={answer.get("id")}
            locked={locked}
            editOnly={editOnly}
            index={i}
            length={list.length}
            answer={answer}
            checkBoxValid={checkBoxValid}
            hovered={hovered.findIndex(item => item.index === i.toString()) >= 0}
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
        label="+ ANSWER"
      />
    </div>
  )
}

export default React.memo(ChooseOneBuildComponent);
