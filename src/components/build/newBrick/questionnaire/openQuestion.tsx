import React from "react";
import NextButton from '../components/nextButton'
import { Grid, Input } from "@material-ui/core";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";

import { NewBrickStep } from "../model";


function OpenQuestion({selectedQuestion, saveOpenQuestion}: any) {
  const [openQuestion, setQuestion] = React.useState(selectedQuestion);
  
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setQuestion(event.target.value as number);
  };

  return (
    <div className="tutorial-page" >
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <div className="left-card">
            <h1 className="only-tutorial-header">Every brick should engage and inspire : 'No profit grows where is no pleasure ta'en'. What open question(s) will challenge users?</h1>
            <Input className="audience-inputs" value={openQuestion} onChange={handleChange} placeholder="Enter Open Question(s)..." />
            <NextButton step={NewBrickStep.OpenQuestion} canSubmit={true} onSubmit={saveOpenQuestion} data={openQuestion} />
          </div>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <Grid container justify="center" item md={5} lg={4}>
            <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default OpenQuestion
