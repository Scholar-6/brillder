import React, {useEffect} from 'react'
import { Grid } from '@material-ui/core';

import './pairMatchBuild.scss'
import {Answer} from './types';
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';
import PairAnswerComponent from './answer/pairAnswer';
import PairOptionComponent from './option/pairOption';
import { UniqueComponentProps } from '../types';


export interface PairMatchBuildProps extends UniqueComponentProps {
}

const PairMatchBuildComponent: React.FC<PairMatchBuildProps> = ({
  locked, data, validationRequired, save, updateComponent
}) => {
  const [height, setHeight] = React.useState('0%');

  useEffect(() => calculateHeight());

  const newAnswer = () => ({ option: "", value: "" });

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
    save();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    state.list.splice(index, 1);
    update();
    save();
  }

  const calculateHeight = () => {
    let showButton = true;
    for (let answer of state.list) {
      if (answer.value === "") {
        showButton = false;
      }
      if (answer.option === "") {
        showButton = false;
      }
    }
    showButton === true ? setHeight('auto') : setHeight('0%');
  }

  const renderAnswer = (answer: Answer, key: number) => {
    return (
      <Grid key={key} container direction="row">
        <PairOptionComponent
          index={key} locked={locked} answer={answer}
          validationRequired={validationRequired}
          update={update} save={save}
        />
        <PairAnswerComponent
          index={key} length={data.list.length} locked={locked} answer={answer}
          validationRequired={validationRequired}
          removeFromList={removeFromList} update={update} save={save}
        />
      </Grid>
    );
  }

  return (
    <div className="pair-match-build">
      <div className="component-title">
        <div>Enter Pairs below, eg. 1 (Option A), I (Answer A).</div>
        <div>Order will be randomised in the Play Interface.</div>
      </div>
      {
        state.list.map((answer: Answer, i: number) => renderAnswer(answer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height={height}
        label="+ &nbsp;&nbsp; P &nbsp; A &nbsp; I &nbsp; R"
      />
    </div>
  )
}

export default PairMatchBuildComponent
