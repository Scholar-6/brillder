import React, { useEffect } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';

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
  const [height, setHeight] = React.useState('0%');

  useEffect(() => calculateHeight());

  if (!data.list) {
    data.list = [{value: ""}];
  }

  const [state, setState] = React.useState(data);

  useEffect(() => {setState(data) }, [data]);

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of state.list) {
      if (answer.value === "") {
        showButton = false;
      }
    }
    showButton === true ? setHeight('auto') : setHeight('0%');
  }

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
  }

  const changed = (shortAnswer: any, event: any) => {
    if (locked) { return; }
    shortAnswer.value = event.target.value;
    update();
  }

  const addShortAnswer = () => {
    if (locked) { return; }
    state.list.push({ value: ""});
    update();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    state.list.splice(index, 1);
    update();
  }

  const renderShortAnswer = (shortAnswer: any, key: number) => {
    return (
      <div className="short-answer-box" key={key}>
        {
          (state.list.length > 1) ? <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} /> : ""
        }
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
        state.list.map((shortAnswer:any, i:number) => renderShortAnswer(shortAnswer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addShortAnswer}
        height={height}
        label="+ &nbsp;&nbsp; S &nbsp; H &nbsp; O &nbsp; R &nbsp; T &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R" />
    </div>
  )
}

export default ShortAnswerBuildComponent
