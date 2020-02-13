import React from 'react'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox'; 

import './chooseOne.scss'

interface ChooseOneAnswer {
  checked: boolean
  value: string
}

interface ChooseOneData {
  list: ChooseOneAnswer[]
}

export interface ChooseOneProps {
  data: ChooseOneData
  updateComponent(component:any):void
}

const ChooseOneComponent: React.FC<ChooseOneProps> = ({data, updateComponent}) => {
  const newAnswer = () => {
    return {value: "", checked: false };
  }
  if (!data.list) {
    data.list = [newAnswer()];
  }
  const changed = (answer: any, event: any) => {
    answer.value = event.target.value;
    updateComponent(data);
  }

  const addAnswer = () => {
    data.list.push(newAnswer());
    updateComponent(data);
  }

  const onChecked = (event:any) => {
    const index = event.target.value;
    for (let answer of data.list) {
      answer.checked = false;
    }
    data.list[index].checked = true;
    updateComponent(data);
  }

  const removeFromList = (index: number) => {
    data.list.splice(index, 1);
    updateComponent(data);
  }

  const renderAnswer = (answer: any, key: number) => {
    return (
      <div className="choose-one-box" key={key}>
        <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} />
        <Checkbox className="left-ckeckbox" checked={answer.checked} onChange={onChecked} value={key} />
        <input value={answer.value} onChange={(event) => changed(answer, event)} placeholder="Enter answer..." />
      </div>
    );
  }

  return (
    <div className="choose-one">
      <DragIndicatorIcon className="rotate-90" />
      {
        data.list.map((answer:any, i:number) => renderAnswer(answer, i))
      }
      <div className="button-box">
        <button className="add-answer-button" onClick={addAnswer}>+ Add Answer</button>
      </div>
    </div>
  )
}

export default ChooseOneComponent
