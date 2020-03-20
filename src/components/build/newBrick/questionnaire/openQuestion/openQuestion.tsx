import React from "react";
import { Grid, Input } from "@material-ui/core";

import ExitButton from '../../components/ExitButton';
import { NewBrickStep } from "../../model";
import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import './openQuestion.scss';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";


function HeadComponent() {
  return (
    <Grid container justify="center" style={{width: '100%', height: '100%', background: '#001D55'}}>
      <img
        alt="head"
        style={{width: 'auto', marginLeft: '0.9vw', marginTop: '9vh', height: '44%'}}
        src="/images/new-brick/head.png">
      </img>
      <p style={{fontSize: '1.25vw', color: 'white', fontFamily: 'Brandon Grotesque Regular', margin: 0, marginBottom: '3.5vh'}}>
        Lorem ipsum dolor sit amet,
        <br></br>
        consetetur sadipscing elitr, sed
        <br></br>
        diam nonumy eirmod tempor?
      </p>
    </Grid>
  )
}

function OpenQuestion({ selectedQuestion, saveOpenQuestion }: any) {
  const [openQuestion, setQuestion] = React.useState(selectedQuestion);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setQuestion(event.target.value as number);
  };

  const getComponent = () => {
    return (<div>Hello</div>);
  }

  return (
    <div className="tutorial-page open-question-page">
      <ExitButton />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={8} lg={8}>
          <Grid justify="center" container item xs={12} sm={11} md={10} lg={9}>
            <div className="left-card">
              <h1 className="only-tutorial-header">
                <p>Ideally, every brick should point to a bigger question.</p>
                <p className="sub-header">Alternatively, bricks can present a puzzle or a challenge which over-arches the topic.</p>
              </h1>
              <Grid container justify="center" item xs={12}>
                <Input
                  className="audience-inputs"
                  value={openQuestion}
                  onChange={handleChange}
                  placeholder="Enter Open Question(s)..." />
              </Grid>
              <PreviousButton to="/build/new-brick/brick-title" />
              <p className="page-number">2 of 6</p>
              <NextButton
                step={NewBrickStep.OpenQuestion}
                canSubmit={true}
                onSubmit={saveOpenQuestion}
                data={openQuestion} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview Component={HeadComponent} link="" />
      </Grid>
    </div>
  );
}

export default OpenQuestion
