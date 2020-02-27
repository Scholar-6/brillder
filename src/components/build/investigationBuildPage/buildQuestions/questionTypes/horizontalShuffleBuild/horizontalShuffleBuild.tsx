import React, {useEffect} from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import AddAnswerButton from '../../baseComponents/addAnswerButton/AddAnswerButton';

import './horizontalShuffleBuild.scss'
import { Grid } from '@material-ui/core';


export interface VerticalShuffleBuildProps {
  locked: boolean
  data: any
  updateComponent(component: any): void
}

const HorizontalShuffleBuildComponent: React.FC<VerticalShuffleBuildProps> = ({ locked, data, updateComponent }) => {
  const [height, setHeight] = React.useState('0');
  
  useEffect(() => {
    calculateHeight();
  });
  
  if (!data.list) {
    data.list = [{ value: "" }, { value: "" }, { value: "" }];
  }

  const changed = (shortAnswer: any, event: any) => {
    if (locked) { return; }
    shortAnswer.value = event.target.value;
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

  const renderAnswer = (answer: any, key: number) => {
    return (
      <Grid container item xs={4} key={key}>
        <div className="horizontal-shuffle-box">
          <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} />
          <input disabled={locked} value={answer.value} onChange={(event) => changed(answer, event)} placeholder={"Enter Answer " + (key + 1) + "..."} />
        </div>
      </Grid>
    );
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

  return (
    <div className="horizontal-shuffle-build">
      <p style={{ marginTop: '6px' }}>Enter Answers below in order.</p>
      <p style={{ marginBottom: '6px' }}>These will be randomised in the Play Interface.</p>
      <Grid container direction="row">
        {
          data.list.map((answer: any, i: number) => renderAnswer(answer, i))
        }
      </Grid>
      <AddAnswerButton
        addAnswer={addAnswer}
        height={height}
        label="+ &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R" />
    </div>
  )
}

export default HorizontalShuffleBuildComponent
