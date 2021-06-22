import React, {useEffect} from 'react'
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
  data: ChooseSeveralData;
  validationRequired: boolean;
  save(): void;
  updateComponent(component:any):void;
  openSameAnswerDialog(): void;
  removeHintAt(index: number): void;
}

export const getDefaultChooseSeveralAnswer = () => {
  const newAnswer = () => ({ id: generateId(), value: "", checked: false, valueFile: '' });

  return { list: [newAnswer(), newAnswer(), newAnswer()] };
}

const ChooseSeveralBuildComponent: React.FC<ChooseSeveralBuildProps> = ({
  locked, editOnly, data, validationRequired, save, updateComponent, openSameAnswerDialog, removeHintAt
}) => {
  const newAnswer = () => ({ id: generateId(), value: "", checked: false, valueFile: '' });

  if (!data.list) {
    data.list = getDefaultChooseSeveralAnswer().list;
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
    updateComponent(data);
  }

  const [state, setState] = React.useState(data);

  useEffect(() => { setState(data) }, [data]);

  const update = () => {
    const newState = Object.assign({}, state);
    newState.list.forEach(answer => {
      if(!answer.id) answer.id = generateId();
    });
    setState(newState);
    updateComponent(state);
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
    removeHintAt(index);
    update();
    save();
  }

  let isChecked = !!validator.validateChooseSeveralChecked(state.list);

  return (
    <div className="choose-several-build unique-component">
      <div className="component-title unselectable">Tick Correct Answers</div>
      {
        state.list.map((answer:any, i:number) => {
          return <ChooseOneAnswerComponent
            locked={locked}
            editOnly={editOnly}
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
            onBlur={() => showSameAnswerPopup(i, state.list, openSameAnswerDialog)}
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
