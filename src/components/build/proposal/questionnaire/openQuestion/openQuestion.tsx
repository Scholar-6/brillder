import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import './openQuestion.scss';
import { ProposalStep, PlayButtonStatus } from "../../model";
import map from 'components/map';
import { enterPressed } from "components/services/key";

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';

interface OpenQuestionProps {
  selectedQuestion: any;
  canEdit: boolean;
  playStatus: PlayButtonStatus;
  history: any;
  saveOpenQuestion(v: string): void;
}

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

const OpenQuestion: React.FC<OpenQuestionProps> = ({
  selectedQuestion, history, canEdit, playStatus, saveOpenQuestion
}) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    saveOpenQuestion(event.target.value as string);
  };

  return (
    <div className="tutorial-page open-question-page">
      <Navigation step={ProposalStep.OpenQuestion} playStatus={playStatus} onMove={() => saveOpenQuestion(selectedQuestion)} />
      <Grid container direction="row">
        <Grid item className="left-block">
          <div className="mobile-view-image">
            <img alt="titles" className="size2" src="/images/new-brick/head.png" />
          </div>
          <h1 className="tutorial-header">Ideally, every brick should <br /> point to a bigger question.</h1>
          <p className="sub-header">Alternatively, bricks can present a puzzle or a challenge which over-arches the topic.</p>
          <Grid item className="input-container">
            <div className="audience-inputs">
              <textarea
                autoFocus={true}
                onKeyUp={e => {
                  if (enterPressed(e)) {
                    history.push(map.ProposalBrief);
                  }
                }}
                disabled={!canEdit}
                value={selectedQuestion}
                onChange={handleChange}
                placeholder="Enter Open Question(s)..."
              />
            </div>
          </Grid>
          <NavigationButtons
            step={ProposalStep.OpenQuestion}
            canSubmit={true}
            onSubmit={saveOpenQuestion}
            data={selectedQuestion}
            backLink={map.ProposalTitle}
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
