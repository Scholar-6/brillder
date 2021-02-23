import React from 'react';
import * as Y from "yjs";
import { Grid } from '@material-ui/core';

import './pairMatchBuild.scss'
import { UniqueComponentProps } from '../types';

import AddAnswerButton from 'components/build/baseComponents/addAnswerButton/AddAnswerButton';
import PairAnswerComponent from './answer/pairAnswer';
import PairOptionComponent from './option/pairOption';
import { generateId, showSameAnswerPopup } from '../service/questionBuild';


export interface PairMatchBuildProps extends UniqueComponentProps { }

export const getDefaultPairMatchAnswer = (ymap: Y.Map<any>) => {
  const newAnswer = () => new Y.Map(Object.entries({ option: new Y.Text(), value: new Y.Text(), id: generateId() }));

  const list = new Y.Array();
  list.push([newAnswer(), newAnswer(), newAnswer()]);

  ymap.set("list", list);
}

const PairMatchBuildComponent: React.FC<PairMatchBuildProps> = ({
  locked, editOnly, data, validationRequired, openSameAnswerDialog
}) => {
  const newAnswer = () => new Y.Map(Object.entries({ option: new Y.Text(), value: new Y.Text(), id: generateId() }));

  let list = data.get("list") as Y.Array<any>;

  const addAnswer = () => {
    if (locked) { return; }
    list.push([newAnswer()]);
  }

  if (!list) {
    getDefaultPairMatchAnswer(data);
    list = data.get("list");
  } else if (list.length < 3) {
    addAnswer();
  }

  const removeFromList = (index: number) => {
    if (locked) { return; }
    list.delete(index);
  }

  const renderAnswer = (answer: Y.Map<any>, i: number) => {
    return (
      <Grid key={answer.get("id")} container direction="row" className="answers-container">
        <PairOptionComponent
          index={i} locked={locked} editOnly={editOnly} answer={answer}
          validationRequired={validationRequired}
        />
        <PairAnswerComponent
          index={i} length={list.length} locked={locked} editOnly={editOnly} answer={answer}
          validationRequired={validationRequired}
          removeFromList={removeFromList}
          onBlur={() => showSameAnswerPopup(i, list.toJSON(), openSameAnswerDialog)}
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
        list.map((answer: Y.Map<any>, i: number) => renderAnswer(answer, i))
      }
      <AddAnswerButton
        locked={locked}
        addAnswer={addAnswer}
        height="auto"
        label="+ PAIR"
      />
    </div>
  )
}

export default PairMatchBuildComponent
