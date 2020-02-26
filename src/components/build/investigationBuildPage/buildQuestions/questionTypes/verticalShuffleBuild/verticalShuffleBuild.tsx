import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';

import './verticalShuffleBuild.scss'


export interface VerticalShuffleBuildProps {
  data: any
  updateComponent(component:any):void
}

const VerticalShuffleBuildComponent: React.FC<VerticalShuffleBuildProps> = ({data, updateComponent}) => {
  if (!data.list) {
    data.list = [{value: ""}];
  }
  const changed = (answer: any, event: any) => {
    answer.value = event.target.value;
    updateComponent(data);
  }

  const addAnswer = () => {
    data.list.push({ value: ""});
    updateComponent(data);
  }

  const removeFromList = (index: number) => {
    data.list.splice(index, 1);
    updateComponent(data);
  }

  const renderAnswer = (answer: any, key: number) => {
    return (
      <div className="short-answer-box" key={key}>
        <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} />
        <input value={answer.value} onChange={(event) => changed(answer, event)} placeholder={"Enter Answer " + (key + 1) + "..."} />
      </div>
    );
  }

  return (
    <div className="vertical-shuffle-build">
      <p style={{marginTop: '6px'}}>Enter Answers below in order.</p>
      <p style={{marginBottom: '6px'}}>These will be randomised in the Play Interface.</p>
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

export default VerticalShuffleBuildComponent
