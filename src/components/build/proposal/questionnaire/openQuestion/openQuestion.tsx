import React from "react";
import { Grid, Hidden, LinearProgress } from "@material-ui/core";

import './openQuestion.scss';
import { ProposalStep, TitleRoutePart } from "../../model";

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import MathInHtml from "components/play/baseComponents/MathInHtml";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import OpenQHoverHelp from "components/build/baseComponents/OpenQHoverHelp";
import PreviousButton from "../../components/previousButton";
import NextButton from "../../components/nextButton";

interface OpenQuestionProps {
  baseUrl: string;
  selectedQuestion: any;
  canEdit: boolean;
  history: any;
  updated: string;
  saveOpenQuestion(v: string): void;
}

const HeadComponent: React.FC<any> = ({ data }) => {
  return (
    <Grid container justify="center" className="phone-preview-component">
      <SpriteIcon name="help-circle" className={data ? "" : "big"} />
      <div className="typing-text">
        <MathInHtml value={data} />
      </div>
    </Grid>
  );
}

const OpenQuestion: React.FC<OpenQuestionProps> = ({
  selectedQuestion, saveOpenQuestion, ...props
}) => {
  let [active, toggleActive] = React.useState(true);
  const onPrevHover = () => {
    toggleActive(false);
  }

  const onPrevOut = () => {
    toggleActive(true);
  }

  const saveOpenQuestionLocal = (v: string) => {
    saveOpenQuestion(v);
  }

  let isValid = selectedQuestion.length <= 255 ? true : false;

  let progressValue = (selectedQuestion.length / 255) * 100;
  if (progressValue > 100) {
    progressValue = 100;
  }

  return (
    <div className="tutorial-page open-question-page">
      <Navigation
        baseUrl={props.baseUrl}
        step={ProposalStep.OpenQuestion}
        onMove={() => saveOpenQuestionLocal(selectedQuestion)}
      />
      <Grid container direction="row">
        <Grid item className="left-block">
          <div className="mobile-view-image">
            <img alt="titles" className="size2" src="/images/new-brick/head.png" />
          </div>
          <h1 className="tutorial-header">Ideally, every brick should <br /> point to a bigger question.</h1>
          <p className="sub-header">
            Alternatively, bricks can present a puzzle or a challenge which over-arches the topic.
          </p>
          <OpenQHoverHelp />
          <QuillEditor
            disabled={!props.canEdit}
            data={selectedQuestion}
            tabIndex={-1}
            placeholder="Open Question"
            toolbar={['bold', 'italic', 'latex']}
            showToolbar={true}
            onChange={saveOpenQuestionLocal}
          />
          <div className={`open-question-validate ${isValid ? 'valid' : 'invalid-text'}`}>
            <div>Open question can be a maximum of 255 characters</div>
            {/* 
            <div>{selectedQuestion.length}/255</div>
            */}
            <div className="open-question-r2-container">
              <LinearProgress
                className="open-question-progressbar"
                variant="determinate"
                value={progressValue}
              />
            </div>
          </div>
          <div className="tutorial-pagination">
            <PreviousButton
              isActive={!active}
              onHover={onPrevHover}
              onOut={onPrevOut}
              to={props.baseUrl + TitleRoutePart}
            />
            <NextButton
              baseUrl={props.baseUrl}
              isActive={active}
              step={ProposalStep.OpenQuestion}
              canSubmit={isValid}
              onSubmit={saveOpenQuestionLocal}
              data={selectedQuestion}
            />
          </div>
          <h2 className="pagination-text">2 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={HeadComponent} data={selectedQuestion} link="" updated={props.updated} />
        <Hidden only={['xs', 'sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default OpenQuestion
