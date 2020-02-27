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
  const [height, setHeight] = React.useState('0');

  useEffect(() => {
    calculateHeight();
  });

  if (!data.list) {
    data.list = [{value: ""}, {value: ""}, {value: ""}];
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
    showButton === true ? setHeight('auto') : setHeight('0');
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
      <AddAnswerButton
        addAnswer={addAnswer}
        height={height}
        label="+ &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; P &nbsp; A &nbsp; I &nbsp; R" />
    </div>
  )
}

export default VerticalShuffleBuildComponent
