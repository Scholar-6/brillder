import React from "react";
import { Grid, Input, Hidden } from "@material-ui/core";

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import { ProposalStep } from "../../model";
import './openQuestion.scss';


const HeadComponent: React.FC<any> = ({ data }) => {
  if (data) {
    return (
      <Grid container justify="center" className="phone-preview-component">
        <img alt="head" src="/images/new-brick/head.png"></img>
        <div className="typing-text">
          <p>{data}</p>
        </div>
      </Grid>
    )
  }
  return (
    <Grid container justify="center" className="phone-preview-component">
      <img alt="head" src="/images/new-brick/head.png" style={{ marginTop: '34%', height: '54%' }}></img>
    </Grid>
  )
}

function OpenQuestion({ selectedQuestion, canEdit, saveOpenQuestion }: any) {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    saveOpenQuestion(event.target.value as number);
  };

  return (
    <div className="tutorial-page open-question-page">
      <Navigation step={ProposalStep.OpenQuestion} onMove={() => saveOpenQuestion(selectedQuestion)} />
      <Grid container direction="row">
        <Grid item className="left-block">
          <div className="mobile-view-image">
            <img alt="titles" className="size2" src="/images/new-brick/head.png" />
          </div>
          <h1 className="tutorial-header">Ideally, every brick should <br /> point to a bigger question.</h1>
          <p className="sub-header">Alternatively, bricks can present a puzzle or a challenge which over-arches the topic.</p>
          <Grid item className="input-container">
            <Input
              className="audience-inputs"
              disabled={!canEdit}
              value={selectedQuestion}
              onChange={handleChange}
              placeholder="Enter Open Question(s)..."
            />
          </Grid>
          <NavigationButtons
            step={ProposalStep.OpenQuestion}
            canSubmit={true}
            onSubmit={saveOpenQuestion}
            data={selectedQuestion}
            backLink="/build/new-brick/brick-title"
          />
          <h2 className="pagination-text">2 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={HeadComponent} data={selectedQuestion} link="" />
        <Hidden only={['xs', 'sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default OpenQuestion
