import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';

import './shortAnswerBuild.scss'


interface ShortAnswerItem {
  value: string
}

interface ShrortAnswerData {
  list: ShortAnswerItem[]
}

export interface ShortAnswerBuildProps {
  data: ShrortAnswerData
  locked: boolean
  updateComponent(component:any):void
}

const ShortAnswerBuildComponent: React.FC<ShortAnswerBuildProps> = ({locked, data, updateComponent}) => {
  if (!data.list) {
    data.list = [{value: ""}];
  }
  const changed = (shortAnswer: any, event: any) => {
    if (locked) { return; }
    shortAnswer.value = event.target.value;
    updateComponent(data);
  }

  const addShortAnswer = () => {
    if (locked) { return; }
    data.list.push({ value: ""});
    updateComponent(data);
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    data.list.splice(index, 1);
    updateComponent(data);
  }

  const renderShortAnswer = (shortAnswer: any, key: number) => {
    return (
      <div className="short-answer-box unique-component-box" key={key}>
        <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} />
        <input
          disabled={locked}
          value={shortAnswer.value}
          onChange={(event) => changed(shortAnswer, event)}
          placeholder="Enter Short Answer..." />
      </div>
    );
  }

  return (
    <div className="short-answer-build unique-component">
      {
        data.list.map((shortAnswer:any, i:number) => renderShortAnswer(shortAnswer, i))
      }
      <div className="button-box">
        <Button disabled={locked} className="add-answer-button" onClick={addShortAnswer}>
          + &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; S &nbsp; H &nbsp; O &nbsp; R &nbsp; T &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R
        </Button>
      </div>
    </div>
  )
}

export default ShortAnswerBuildComponent
