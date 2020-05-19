import React, {useEffect } from 'react'

import './chooseOneBuild.scss';
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';
import ChooseOneAnswerComponent from './ChooseOneAnswer';
import {ChooseOneAnswer} from './types';
import { QuestionValueType } from '../types';


export interface ChooseOneData {
  list: ChooseOneAnswer[];
}

export interface ChooseOneBuildProps {
  locked: boolean;
  data: ChooseOneData;
  save(): void;
  updateComponent(component:any):void;
}

const ChooseOneBuildComponent: React.FC<ChooseOneBuildProps> = ({
  locked, data, save, updateComponent
}) => {
  const [height, setHeight] = React.useState('0%');

  useEffect(() => calculateHeight());

  const newAnswer = () => ({value: "", checked: false, valueFile: "" });

  if (!data.list) {
    data.list = [newAnswer(), newAnswer(), newAnswer()];
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
  }

  const [state, setState] = React.useState(data);

  useEffect(() => { setState(data) }, [data]);

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
    calculateHeight();
  }

  const addAnswer = () => {
    if (locked) { return; }
    state.list.push(newAnswer());
    update();
    save();
  }

  const onChecked = (event:any) => {
    if (locked) { return; }
    const index = event.target.value;
    for (let answer of state.list) {
      answer.checked = false;
    }
    state.list[index].checked = true;
    update();
    save();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    state.list.splice(index, 1);
    update();
    save();
  }

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of state.list) {
      console.log(answer);
      if (answer.answerType !== QuestionValueType.Image) {
        if (answer.value === "") {
          showButton = false;
        }
      }
    }
    showButton === true ? setHeight('auto') : setHeight('0%');
  }

  return (
    <div className="choose-one-build unique-component">
      <div className="component-title">
        Tick Correct Answer
      </div>
      {
        state.list.map((answer:any, i:number) => {
          return <ChooseOneAnswerComponent
            key={i}
            locked={locked}
            index={i}
            length={data.list.length}
            answer={answer}
            save={save}
            removeFromList={removeFromList}
            onChecked={onChecked}
            update={update}
          />
        })
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height={height}
        label="+ &nbsp;&nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R" />
    </div>
  )
}

export default ChooseOneBuildComponent
