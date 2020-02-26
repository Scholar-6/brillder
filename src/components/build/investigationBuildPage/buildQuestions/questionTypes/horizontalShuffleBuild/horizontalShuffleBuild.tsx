import React from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Button } from '@material-ui/core';
import AnimateHeight from 'react-animate-height';

import './horizontalShuffleBuild.scss'
import { Grid } from '@material-ui/core';


export interface VerticalShuffleBuildProps {
  data: any
  updateComponent(component: any): void
}

const HorizontalShuffleBuildComponent: React.FC<VerticalShuffleBuildProps> = ({ data, updateComponent }) => {
  const [height, setHeight] = React.useState('0');
  if (!data.list) {
    data.list = [{ value: "" }, { value: "" }, { value: "" }];
  }
  const changed = (shortAnswer: any, event: any) => {
    shortAnswer.value = event.target.value;
    updateComponent(data);
    console.log('changed')
    calculateHeight();
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
      <Grid container item xs={4} key={key}>
        <div className="horizontal-shuffle-box">
          <DeleteIcon className="right-top-icon" onClick={() => removeFromList(key)} />
          <input value={answer.value} onChange={(event) => changed(answer, event)} placeholder={"Enter Answer " + (key + 1) + "..."} />
        </div>
      </Grid>
    );
  }

  const calculateHeight = () => {
    let showButton = true;
    let height = 100;
    for (let answer of data.list) {
      console.log(answer)
      if (answer.value === "") {
        showButton = false;
        height = 0;
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
      <AnimateHeight
        duration={500}
        height={height}
      >
        <div className="button-box">
          <Button className="add-answer-button" onClick={addAnswer}>
            + &nbsp;&nbsp; A &nbsp; D &nbsp; D &nbsp; &nbsp; A &nbsp; N &nbsp; S &nbsp; W &nbsp; E &nbsp; R
        </Button>
        </div>
      </AnimateHeight>
    </div>
  )
}

export default HorizontalShuffleBuildComponent
