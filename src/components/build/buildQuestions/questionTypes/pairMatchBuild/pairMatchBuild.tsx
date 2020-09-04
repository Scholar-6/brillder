import React, {useEffect} from 'react'
import { Grid } from '@material-ui/core';

import './pairMatchBuild.scss'
import {Answer} from './types';
import { UniqueComponentProps } from '../types';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import PairAnswerComponent from './answer/pairAnswer';
import PairOptionComponent from './option/pairOption';
import { showSameAnswerPopup } from '../service/questionBuild';


export interface PairMatchBuildProps extends UniqueComponentProps { }

const PairMatchBuildComponent: React.FC<PairMatchBuildProps> = ({
  locked, editOnly, data, validationRequired, save, updateComponent, openSameAnswerDialog
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

  const renderAnswer = (answer: Answer, i: number) => {
    return (
      <Grid key={i} container direction="row" className="answers-container">
        <PairOptionComponent
          index={i} locked={locked} editOnly={editOnly} answer={answer}
          validationRequired={validationRequired}
          update={update} save={save}
        />
        <PairAnswerComponent
          index={i} length={data.list.length} locked={locked} editOnly={editOnly} answer={answer}
          validationRequired={validationRequired}
          removeFromList={removeFromList} update={update} save={save}
          onBlur={() => showSameAnswerPopup(i, state.list, openSameAnswerDialog)}
        />
      </Grid>
    );
  }

  return (
    <div className="pair-match-build unique-component">
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
        label="+ PAIR"
      />
    </div>
  )
}

export default PairMatchBuildComponent
