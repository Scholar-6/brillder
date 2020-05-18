import React, {useEffect} from 'react'
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';

import './chooseSeveralBuild.scss'
import ChooseOneAnswerComponent from '../chooseOneBuild/ChooseOneAnswer';


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
  const [height, setHeight] = React.useState('0%');

  useEffect(() => calculateHeight());

  const newAnswer = () => ({value: "", checked: false });

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

  const addAnswer = () => {
    if (locked) { return; }
    state.list.push(newAnswer());
    update();
  }

  const onChecked = (event:React.ChangeEvent<HTMLInputElement>) => {
    if (locked) { return; }
    const index = parseInt(event.target.value);
    state.list[index].checked = event.target.checked;
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

  return (
    <div className="choose-several-build unique-component">
      <div className="component-title">
        Tick Correct Answers
      </div>
      {
        state.list.map((answer:any, i:number) => {
          return <ChooseOneAnswerComponent
            locked={locked}
            key={i}
            index={i}
            length={data.list.length}
            answer={answer}
            removeFromList={removeFromList}
            onChecked={onChecked}
            update={update}
          />
        })
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height={height}
        label="+ &nbsp;&nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R" />
    </div>
  )
}

export default ChooseSeveralBuildComponent
