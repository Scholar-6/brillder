import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import './openQuestion.scss';
import { ProposalStep, TitleRoutePart } from "../../model";

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import MathInHtml from "components/play/baseComponents/MathInHtml";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import OpenQHoverHelp from "components/build/baseComponents/OpenQHoverHelp";

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
  const saveOpenQuestionLocal = (v: string) => {
    const value = v.substr(0, 250);
    saveOpenQuestion(value);
  }

  console.log(selectedQuestion.length);

  var openQuestion = selectedQuestion.slice()

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
            data={openQuestion}
            tabIndex={-1}
            placeholder="Open Question"
            toolbar={['bold', 'italic', 'latex']}
            showToolbar={true}
            onChange={saveOpenQuestionLocal}
          />
          <NavigationButtons
            baseUrl={props.baseUrl}
            step={ProposalStep.OpenQuestion}
            canSubmit={true}
            onSubmit={saveOpenQuestionLocal}
            data={selectedQuestion}
            backLink={props.baseUrl + TitleRoutePart}
          />
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
