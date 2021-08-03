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

export const getDefaultPairMatchAnswer = () => {
  const newAnswer = () => ({ option: "", value: "" });

  return { list: [newAnswer(), newAnswer(), newAnswer()] };
}

const PairMatchBuildComponent: React.FC<PairMatchBuildProps> = ({
  locked, editOnly, data, validationRequired, save, updateComponent, openSameAnswerDialog, removeHintAt
}) => {
  const newAnswer = () => ({ option: "", value: "" });

  if (!data.list) {
    data.list = getDefaultPairMatchAnswer().list;
  } else if (data.list.length < 3) {
    data.list.push(newAnswer());
    updateComponent(data);
  }

  const [state, setState] = React.useState(data);
  useEffect(() => { setState(data) }, [data]);

  const update = () => {
    setState(Object.assign({}, state));
    updateComponent(state);
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
    removeHintAt(index);
    update();
    save();
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
    <div className="pair-match-build">
      <div className="component-title">
        Enter Pairs below so that Option 1 matches with Answer 1 and so on.
        These will be randomised in the play interface.
      </div>
      {
        state.list.map((answer: Answer, i: number) => renderAnswer(answer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height="auto"
        label="Add a pair"
      />
    </div>
  )
}

export default PairMatchBuildComponent
