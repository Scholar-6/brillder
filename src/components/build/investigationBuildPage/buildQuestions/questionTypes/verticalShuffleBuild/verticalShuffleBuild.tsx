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

  useEffect(() => calculateHeight());

  const newAnswer = () => ({value: ""});
  
  if (!data.list) {
    data.list = [newAnswer(), newAnswer(), newAnswer()];
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
    updateComponent(data);
  }

  const [state, setState] = React.useState(data);

  useEffect(() => { setState(data) }, [data]);

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
    calculateHeight();
  }

  const changed = (answer: any, event: any) => {
    if (locked) { return; }
    answer.value = event.target.value;
    update();
  }

  const addAnswer = () => {
    if (locked) { return; }
    state.list.push({ value: ""});
    update();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    state.list.splice(index, 1);
    update();
  }

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of state.list) {
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
          (state.list.length > 3) ? <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} /> : ""
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
        state.list.map((answer:any, i:number) => renderAnswer(answer, i))
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
