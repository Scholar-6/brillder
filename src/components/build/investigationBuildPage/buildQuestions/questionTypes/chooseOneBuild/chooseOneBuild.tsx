import React, {useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox'; 
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';

import './chooseOneBuild.scss';


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

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
    calculateHeight();
  }

  const changed = (answer: any, event: any) => {
    if (locked) { return; }
    answer.value = event.target.value;
    update();
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

  const renderAnswer = (answer: any, key: number) => {
    return (
      <div className="choose-one-box unique-component-box" key={key}>
        {
          (state.list.length > 3) ? <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} /> : ""
        }
        <Checkbox className="left-ckeckbox" disabled={locked} checked={answer.checked} onChange={onChecked} value={key} />
        <input disabled={locked} value={answer.value} onChange={(event) => changed(answer, event)} placeholder="Enter Answer..." />
      </div>
    );
  }

  return (
    <div className="choose-one-build unique-component">
      <div className="component-title">
        <div>Tick correct answer</div>
      </div>
      {
        state.list.map((answer:any, i:number) => renderAnswer(answer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height={height}
        label="+ &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R" />
    </div>
  )
}

export default ChooseOneBuildComponent
