import React, {useEffect} from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';

import './verticalShuffleBuild.scss'


export interface VerticalShuffleBuildProps {
  locked: boolean
  data: any
  updateComponent(component:any):void
}

const VerticalShuffleBuildComponent: React.FC<VerticalShuffleBuildProps> = ({locked, data, updateComponent}) => {
  const [height, setHeight] = React.useState('0%');

  useEffect(() => {
    calculateHeight();
  });

  const newAnswer = () => ({value: ""});
  
  if (!data.list) {
    data.list = [newAnswer(), newAnswer(), newAnswer()];
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
    updateComponent(data);
  }

  const changed = (answer: any, event: any) => {
    if (locked) { return; }
    answer.value = event.target.value;
    updateComponent(data);
    calculateHeight();
  }

  const addAnswer = () => {
    if (locked) { return; }
    data.list.push({ value: ""});
    updateComponent(data);
    calculateHeight();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    data.list.splice(index, 1);
    updateComponent(data);
    calculateHeight();
  }

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of data.list) {
      if (answer.value === "") {
        showButton = false;
      }
    }
    showButton === true ? setHeight('auto') : setHeight('0%');
  }

  const renderAnswer = (answer: any, key: number) => {
    return (
      <div className="short-answer-box" key={key}>
        {
          (data.list.length > 3) ? <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} /> : ""
        }
        <input
          disabled={locked}
          value={answer.value}
          onChange={(event) => changed(answer, event)}
          placeholder={"Enter Answer " + (key + 1) + "..."} />
      </div>
    );
  }

  return (
    <div className="vertical-shuffle-build">
      <div className="component-title">
        <div>Enter Answers below in order.</div>
        <div>These will be randomised in the Play Interface.</div>
      </div>
      {
        data.list.map((answer:any, i:number) => renderAnswer(answer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height={height}
        label="+ &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; P &nbsp; A &nbsp; I &nbsp; R" />
    </div>
  )
}

export default VerticalShuffleBuildComponent
