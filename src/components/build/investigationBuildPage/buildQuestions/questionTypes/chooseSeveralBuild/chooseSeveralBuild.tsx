import React, {useEffect} from 'react'
import CloseIcon from '@material-ui/icons/Close';
import Checkbox from '@material-ui/core/Checkbox'; 
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';

import './chooseSeveralBuild.scss'


interface ChooseSeveralAnswer {
  checked: boolean
  value: string
}

export interface ChooseSeveralData {
  list: ChooseSeveralAnswer[]
}

export interface ChooseSeveralBuildProps {
  locked: boolean
  data: ChooseSeveralData
  updateComponent(component:any):void
}

const ChooseSeveralBuildComponent: React.FC<ChooseSeveralBuildProps> = ({locked, data, updateComponent}) => {
  const [height, setHeight] = React.useState('0');

  useEffect(() => {
    calculateHeight();
  });

  const newAnswer = () => {
    return {value: "", checked: false };
  }
  if (!data.list) {
    data.list = [newAnswer(), newAnswer(), newAnswer()];
  }
  const changed = (answer: any, event: any) => {
    if (locked) { return; }
    answer.value = event.target.value;
    updateComponent(data);
    calculateHeight();
  }

  const addAnswer = () => {
    if (locked) { return; }
    data.list.push(newAnswer());
    updateComponent(data);
    calculateHeight();
  }

  const onChecked = (event:React.ChangeEvent<HTMLInputElement>) => {
    if (locked) { return; }
    const index = parseInt(event.target.value);
    data.list[index].checked = event.target.checked;
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
    if (showButton === true) {
      setHeight('auto');
    } else {
      setHeight('0');
    }
  }

  const renderAnswer = (answer: any, key: number) => {
    return (
      <div className="choose-several-box unique-component-box" key={key}>
        <CloseIcon className="right-top-icon" onClick={() => removeFromList(key)} />
        <Checkbox className="left-ckeckbox" disabled={locked} checked={answer.checked} onChange={onChecked} value={key} />
        <input value={answer.value} onChange={(event) => changed(answer, event)} placeholder="Enter answer..." />
      </div>
    );
  }

  return (
    <div className="choose-several-build unique-component">
      <p>Tick correct answers</p>
      {
        data.list.map((answer:any, i:number) => renderAnswer(answer, i))
      }
      <AddAnswerButton
        addAnswer={addAnswer}
        height={height}
        label="+ &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R" />
    </div>
  )
}

export default ChooseSeveralBuildComponent
