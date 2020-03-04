import React from "react";
import { Grid, Input } from "@material-ui/core";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";

import { NewBrickStep } from "../../model";

import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import './openQuestion.scss';


function OpenQuestion({ selectedQuestion, saveOpenQuestion }: any) {
  const [openQuestion, setQuestion] = React.useState(selectedQuestion);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setQuestion(event.target.value as number);
  };

  return (
    <div className="tutorial-page open-question-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <div className="left-card">
          <div style={{position: 'absolute', top: 0, right: 0, width: '100%', height: '100%'}}>
            <h1 className="only-tutorial-header">
              <p>Ideally, every brick should point to a bigger question.</p>
              <p>Alternatively, bricks can present a puzzle or</p>
              <p>a challenge which over-arches the topic.</p>
            </h1>
            <Grid container justify="center" item xs={12}>
              <Input
                className="audience-inputs"
                value={openQuestion}
                onChange={handleChange}
                placeholder="Enter Open Question(s)..." />
            </Grid>
            <PreviousButton to="/build/new-brick/brick-title" />
            <NextButton
              step={NewBrickStep.OpenQuestion}
              canSubmit={true}
              onSubmit={saveOpenQuestion}
              data={openQuestion} />
          </div>
        </div>
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
