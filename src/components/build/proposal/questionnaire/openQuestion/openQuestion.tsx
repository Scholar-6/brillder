import React from "react";
import * as Y from "yjs";
import { Grid, Hidden } from "@material-ui/core";

import './openQuestion.scss';
import { ProposalStep, PlayButtonStatus, TitleRoutePart } from "../../model";

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import MathInHtml from "components/play/baseComponents/MathInHtml";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import { toRenderJSON } from "services/SharedTypeService";

interface OpenQuestionProps {
  baseUrl: string;
  selectedQuestion: Y.Text;
  canEdit: boolean;
  playStatus: PlayButtonStatus;
  history: any;
  saveAndPreview(): void;
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
  selectedQuestion, ...props
}) => {
  return (
    <div className="tutorial-page open-question-page">
      <Navigation
        baseUrl={props.baseUrl}
        step={ProposalStep.OpenQuestion}
        playStatus={props.playStatus}
        saveAndPreview={props.saveAndPreview}
        onMove={() => {}}
      />
      <Grid container direction="row" alignItems="flex-start">
        <Grid item className="left-block">
          <div className="mobile-view-image">
            <img alt="titles" className="size2" src="/images/new-brick/head.png" />
          </div>
          <h1 className="tutorial-header">Ideally, every brick should <br /> point to a bigger question.</h1>
          <p className="sub-header">
            Alternatively, bricks can present a puzzle or a challenge which over-arches the topic.
          </p>
          <QuillEditor
            disabled={!props.canEdit}
            sharedData={selectedQuestion}
            toolbar={[
              'bold', 'italic', 'latex'
            ]}
          />
          <NavigationButtons
            baseUrl={props.baseUrl}
            step={ProposalStep.OpenQuestion}
            canSubmit={true}
            onSubmit={() => {}}
            data={selectedQuestion}
            backLink={props.baseUrl + TitleRoutePart}
          />
          <h2 className="pagination-text">2 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={HeadComponent} data={toRenderJSON(selectedQuestion)} link="" />
        <Hidden only={['xs', 'sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default OpenQuestion
