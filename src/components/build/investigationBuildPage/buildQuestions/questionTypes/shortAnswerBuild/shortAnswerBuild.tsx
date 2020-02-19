import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';

import './shortAnswerBuild.scss'


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
        <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} />
        <input value={shortAnswer.value} onChange={(event) => changed(shortAnswer, event)} placeholder="Enter short answer..." />
      </div>
    );
  }

  return (
    <div className="short-answer-build">
      {
        data.list.map((shortAnswer:any, i:number) => renderShortAnswer(shortAnswer, i))
      }
      <div className="button-box">
        <button className="add-answer-button" onClick={addShortAnswer}>+ Add Short Answer</button>
      </div>
    </div>
  )
}

export default ShortAnswerBuildComponent
