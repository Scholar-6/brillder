import React, {useEffect } from 'react'

import './chooseOneBuild.scss';
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';
import ChooseOneAnswer from './ChooseOneAnswer';

interface ChooseOneBuildAnswer {
  checked: boolean
  value: string
}

export interface ChooseOneData {
  list: ChooseOneBuildAnswer[]
}

export interface ChooseOneBuildProps {
  locked: boolean
  data: ChooseOneData
  updateComponent(component:any):void
}

const ChooseOneBuildComponent: React.FC<ChooseOneBuildProps> = ({locked, data, updateComponent}) => {
  const [height, setHeight] = React.useState('0%');

  useEffect(() => calculateHeight());

  const newAnswer = () => ({value: "", checked: false });

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
  }

  const onChecked = (event:any) => {
    if (locked) { return; }
    const index = event.target.value;
    for (let answer of state.list) {
      answer.checked = false;
    }
    state.list[index].checked = true;
    update();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    state.list.splice(index, 1);
    update();
  }

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of state.list) {
      if (answer.value === "") {
        showButton = false;
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
          return <ChooseOneAnswer
            key={i}
            locked={locked}
            index={i}
            length={data.list.length}
            answer={answer}
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
