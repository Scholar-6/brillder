import React, {useEffect} from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Grid } from '@material-ui/core';
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';

import './pairMatchBuild.scss'


export interface PairMatchBuildProps {
  locked: boolean
  data: any
  updateComponent(component: any): void
}

const PairMatchBuildComponent: React.FC<PairMatchBuildProps> = ({ locked, data, updateComponent }) => {
  const [height, setHeight] = React.useState('0');

  useEffect(() => {
    calculateHeight();
  });

  if (!data.list) {
    data.list = [{ value: "" }, { value: "" }, { value: "" }];
  }

  const optionChanged = (answer: any, event: any) => {
    if (locked) { return; }
    answer.option = event.target.value;
    updateComponent(data);
    calculateHeight();
  }

  const answerChanged = (answer: any, event: any) => {
    if (locked) { return; }
    answer.value = event.target.value;
    updateComponent(data);
    calculateHeight();
  }

  const addAnswer = () => {
    if (locked) { return; }
    data.list.push({ value: "" });
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
      <Grid container direction="row">
        <Grid container item xs={6} key={key}>
          <div className="pair-match-option" key={key}>
            <input
              disabled={locked}
              value={answer.option}
              onChange={(event) => optionChanged(answer, event)}
              placeholder={"Enter Option " + (key + 1) + "..."} />
          </div>
        </Grid>
        <Grid container item xs={6} key={key}>
          <div className="pair-match-answer" key={key}>
            <DeleteIcon className="right-top-icon" style={{right: '1%'}} onClick={() => removeFromList(key)} />
            <input
              disabled={locked}
              value={answer.value}
              onChange={(event) => answerChanged(answer, event)}
              placeholder={"Enter Answer " + (key + 1) + "..."} />
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
      <AddAnswerButton
        addAnswer={addAnswer}
        height={height}
        label="+ &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; P &nbsp; A &nbsp; I &nbsp; R" />
    </div>
  )
}

export default PairMatchBuildComponent
