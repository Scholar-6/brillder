import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';
import { Grid } from '@material-ui/core';

import './pairMatchBuild.scss'


export interface PairMatchBuildProps {
  data: any
  updateComponent(component: any): void
}

const PairMatchBuildComponent: React.FC<PairMatchBuildProps> = ({ data, updateComponent }) => {
  if (!data.list) {
    data.list = [{ value: "" }];
  }
  const optionChanged = (answer: any, event: any) => {
    answer.option = event.target.value;
    updateComponent(data);
  }

  const answerChanged = (answer: any, event: any) => {
    answer.value = event.target.value;
    updateComponent(data);
  }

  const addAnswer = () => {
    data.list.push({ value: "" });
    updateComponent(data);
  }

  const removeFromList = (index: number) => {
    data.list.splice(index, 1);
    updateComponent(data);
  }

  const renderAnswer = (answer: any, key: number) => {
    return (
      <Grid container direction="row">
        <Grid container item xs={6} key={key}>
          <div className="pair-match-option" key={key}>
            <input value={answer.option} onChange={(event) => optionChanged(answer, event)} placeholder={"Enter Answer " + (key + 1) + "..."} />
          </div>
        </Grid>
        <Grid container item xs={6} key={key}>
          <div className="pair-match-answer" key={key}>
            <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} />
            <input value={answer.value} onChange={(event) => answerChanged(answer, event)} placeholder={"Enter Answer " + (key + 1) + "..."} />
          </div>
        </Grid>
      </Grid>
    );
  }

  return (
    <div className="pair-match-build">
      <p style={{ marginTop: '6px' }}>Enter Pairs below, eg. 1 (Option A), I (Answer A).</p>
      <p style={{ marginBottom: '6px' }}>Order will be randomised in the Play Interface.</p>
      {
        data.list.map((answer: any, i: number) => renderAnswer(answer, i))
      }
      <div className="button-box">
        <Button className="add-answer-button" onClick={addAnswer}>+ Add Pair</Button>
      </div>
    </div>
  )
}

export default PairMatchBuildComponent
