import React from "react";
import NextButton from '../components/nextButton'
import { Grid, Input } from "@material-ui/core";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";

import { NewBrickStep } from "../model";
import './openQuestion.scss';


function OpenQuestion({ selectedQuestion, saveOpenQuestion }: any) {
  const [openQuestion, setQuestion] = React.useState(selectedQuestion);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setQuestion(event.target.value as number);
  };

  return (
    <div className="tutorial-page open-question-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <div className="left-card">
            <h1 className="only-tutorial-header">
              <p>Every brick should engage and inspire:</p>
              <p>'No profit grows where is no pleasure ta'en'.</p>
              <p>What open question(s) will challenge users?</p>
            </h1>
            <Grid container justify="center" item xs={12}>
              <Input className="audience-inputs" value={openQuestion} onChange={handleChange} placeholder="Enter Open Question(s)..." />
            </Grid>
            <NextButton step={NewBrickStep.OpenQuestion} canSubmit={true} onSubmit={saveOpenQuestion} data={openQuestion} />
          </div>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <div style={{ right: "5%", position: "fixed", width: '19.3%', paddingTop: '33.3%' }}>
            <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
          </div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default OpenQuestion
