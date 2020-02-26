import React from 'react'
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox'; 
import { Button } from '@material-ui/core';

import './chooseOneBuild.scss'


interface ChooseOneBuildAnswer {
  checked: boolean
  value: string
}

export interface ChooseOneData {
  list: ChooseOneBuildAnswer[]
}

export interface ChooseOneBuildProps {
  data: ChooseOneData
  updateComponent(component:any):void
}

const ChooseOneBuildComponent: React.FC<ChooseOneBuildProps> = ({data, updateComponent}) => {
  const newAnswer = () => {
    return {value: "", checked: false };
  }
  if (!data.list) {
    data.list = [newAnswer(), newAnswer(), newAnswer()];
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
      <div className="choose-one-box unique-component-box" key={key}>
        <CloseIcon className="right-top-icon" onClick={() => removeFromList(key)} />
        <Checkbox className="left-ckeckbox" checked={answer.checked} onChange={onChecked} value={key} />
        <input value={answer.value} onChange={(event) => changed(answer, event)} placeholder="Enter answer..." />
      </div>
    );
  }

  return (
    <div className="choose-one-build unique-component">
      <p>Tick correct answer</p>
      {
        data.list.map((answer:any, i:number) => renderAnswer(answer, i))
      }
      <div className="button-box">
        <Button className="add-answer-button" onClick={addAnswer}>
          + &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R
        </Button>
      </div>
    </div>
  )
}

export default ChooseOneBuildComponent
