import React from 'react'
import CloseIcon from '@material-ui/icons/Close';

import './shortAnswerBuild.scss'
import { Button } from '@material-ui/core';


export interface ShortAnswerBuildProps {
  data: any
  updateComponent(component:any):void
}

const ShortAnswerBuildComponent: React.FC<ShortAnswerBuildProps> = ({data, updateComponent}) => {
  if (!data.list) {
    data.list = [{value: ""}];
  }
  const changed = (shortAnswer: any, event: any) => {
    shortAnswer.value = event.target.value;
    updateComponent(data);
  }

  const addShortAnswer = () => {
    data.list.push({ value: ""});
    updateComponent(data);
  }

  const removeFromList = (index: number) => {
    data.list.splice(index, 1);
    updateComponent(data);
  }

  const renderShortAnswer = (shortAnswer: any, key: number) => {
    return (
      <div className="short-answer-box" key={key}>
        <CloseIcon className="right-top-icon" onClick={() => removeFromList(key)} />
        <input value={shortAnswer.value} onChange={(event) => changed(shortAnswer, event)} placeholder="Enter Short Answer..." />
      </div>
    );
  }

  return (
    <div className="short-answer-build">
      {
        data.list.map((shortAnswer:any, i:number) => renderShortAnswer(shortAnswer, i))
      }
      <div className="button-box">
        <Button className="add-answer-button" onClick={addShortAnswer}>
          + &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; S &nbsp; H &nbsp; O &nbsp; R &nbsp; T &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R
        </Button>
      </div>
    </div>
  )
}

export default ShortAnswerBuildComponent
