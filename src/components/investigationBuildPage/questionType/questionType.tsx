import React from 'react'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Grid, Slider, Box } from '@material-ui/core';

import './questionType.scss';
import { QuestionType } from '../../model/question';

export interface QuestionTypeProps { }

function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

const QuestionTypePage: React.FC<QuestionTypeProps> = (props:any) => {
  let typeArray: string[] = Object.keys(QuestionType);
  console.log(props)
  typeArray = typeArray.map(SplitByCapitalLetters)

  function addQuestion() {
    props.history.push("/build/investigation/question/component");
  }

  return (
    <div className="question-type-sub-page">
      <Grid container direction="row">
        <Grid container className="left-sidebar sidebar" justify="center" item xs={2} sm={1}>
        </Grid>
        <Grid container item xs={8} sm={10}>
          <Grid container direction="row">
            <Grid xs={1} sm={2} item md={3}></Grid>
            <Grid container justify="center" item xs={10} sm={8} md={6} className="question">
              <Grid container direction="row" justify="center" className="card-description">
                Choose question type...
              </Grid>
              <Grid container direction="row">
                {
                  typeArray.map((item, i) => {
                    return (
                      <Grid xs={3} item key={i}>
                        <Box className="question-container" onClick={addQuestion}>
                          <div className="link-description">{item}</div>
                        </Box>
                      </Grid>
                    );
                  })
                }
              </Grid>
            </Grid>
          </Grid>
          <br />
        </Grid>
        <Grid container className="right-sidebar sidebar" item xs={2} sm={1}>
        </Grid>
      </Grid>
      <Grid container direction="row" className="page-fotter">
        <Grid container item xs={4} sm={7} md={8} lg={9}></Grid>
        <Grid container item xs={7} sm={4} md={3} lg={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <RemoveIcon className="white" color="inherit" />
            </Grid>
            <Grid item xs>
              <Slider className="white" aria-labelledby="continuous-slider" />
            </Grid>
            <Grid item>
              <AddIcon className="white" color="inherit" />
            </Grid>
            <Grid item className="percentages">
              55 %
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default QuestionTypePage
