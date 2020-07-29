import React, {useEffect} from 'react'
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';

import './chooseSeveralBuild.scss'
import ChooseOneAnswerComponent from '../chooseOneBuild/ChooseOneAnswer';
import {ChooseOneAnswer} from '../chooseOneBuild/types';
import { QuestionValueType } from '../types';
import validator from '../../../questionService/UniqueValidator'
import { stripHtml } from "components/build/investigationBuildPage/questionService/ConvertService";

export interface ChooseSeveralData {
  list: ChooseOneAnswer[];
}

export interface ChooseSeveralBuildProps {
  locked: boolean;
  data: ChooseSeveralData;
  validationRequired: boolean;
  save(): void;
  updateComponent(component:any):void;
  openSameAnswerDialog(): void;
}

const ChooseSeveralBuildComponent: React.FC<ChooseSeveralBuildProps> = ({
  locked, data, validationRequired, save, updateComponent, openSameAnswerDialog
}) => {
  const [height, setHeight] = React.useState('0%');

  useEffect(() => calculateHeight());

  const newAnswer = () => ({value: "", checked: false, valueFile: '' });

  if (!data.list) {
    data.list = [newAnswer(), newAnswer(), newAnswer()];
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
    updateComponent(data);
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

  const onChecked = (event:React.ChangeEvent<HTMLInputElement>) => {
    if (locked) { return; }
    const index = parseInt(event.target.value);
    state.list[index].checked = event.target.checked;
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
      if (answer.answerType !== QuestionValueType.Image) {
        if (answer.value === "") {
          showButton = false;
        }
      }
    }
    showButton === true ? setHeight('auto') : setHeight('0%');
  }

  let isChecked = !!validator.validateChooseSeveralChecked(state.list);

  const onBlur = (i: number) => {
    let answerText = stripHtml(state.list[i].value);
    let list = state.list as any;
    for (let [index, item] of list.entries()) {
      if (index !== i && item.value) {
        let text = stripHtml(item.value)
        if (answerText === text) {
          openSameAnswerDialog();
        }
      }
    }
  }

  return (
    <div className="choose-several-build unique-component">
      <div className="component-title">Tick Correct Answers</div>
      {
        state.list.map((answer:any, i:number) => {
          return <ChooseOneAnswerComponent
            locked={locked}
            key={i}
            index={i}
            length={data.list.length}
            answer={answer}
            save={save}
            checkBoxValid={isChecked}
            validationRequired={validationRequired}
            removeFromList={removeFromList}
            onChecked={onChecked}
            update={update}
            onBlur={() => onBlur(i)}
          />
        })
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height={height}
        label="+ ANSWER" />
    </div>
  )
}

export default ChooseSeveralBuildComponent
