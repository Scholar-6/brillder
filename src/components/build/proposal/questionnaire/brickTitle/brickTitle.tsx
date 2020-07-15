import React from "react";
import { Grid, Input, Hidden } from "@material-ui/core";

import './brickTitle.scss';
import { ProposalStep } from "../../model";
import NextButton from '../../components/nextButton';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import { Brick } from "model/brick";
import { getDate, getMonth, getYear } from 'components/services/brickService';
import { setBrillderTitle } from "components/services/titleService";


interface BrickTitleProps {
  parentState: Brick;
  canEdit: boolean;
  saveTitles(data: any): void;
}

const BrickTitlePreviewComponent: React.FC<any> = (props) => {
  let { subTopic, alternativeTopics, title, author } = props.data;

  const date = new Date();
  const dateString = `${getDate(date)}.${getMonth(date)}.${getYear(date)}`;

  const renderAuthorRow = () => {
    let data = "";
    if (author) {
      data = (author.firstName ? author.firstName + ' ' + author.lastName : 'Author') + ' | ' + dateString;
    } else {
      data = "Author | " + dateString;
    }
    return data;
  }

  if (!title && !alternativeTopics && !subTopic) {
    return (
      <Grid container alignContent="flex-start" className="phone-preview-component title">
        <Grid container justify="center">
          <img alt="titles" src="/images/new-brick/titles.png" className="titles-image big" />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container alignContent="flex-start" className="phone-preview-component title">
      <Grid container justify="center">
        <img alt="titles" src="/images/new-brick/titles.png" className="titles-image" />
      </Grid>
      <div className="brick-preview-container">
        <div className={"brick-title uppercase " + (title ? 'topic-filled' : '')}>
          {title ? title : 'TITLE'}
        </div>
        <div className="brick-topics">
          <span className={subTopic ? 'topic-filled' : ''}>
            {subTopic ? subTopic : 'Topic'}
          </span> | <span className={alternativeTopics ? 'topic-filled' : ''}>
            {alternativeTopics ? alternativeTopics : 'Subtopic(s)'}
          </span>
        </div>
        <div className="author-row">
          {renderAuthorRow()}
        </div>
      </div>
    </Grid>
  )
}


const BrickTitle: React.FC<BrickTitleProps> = ({ parentState, canEdit, saveTitles }) => {
  const onTitleChange = (event: React.ChangeEvent<{ value: string }>) => {
    const title = event.target.value.substr(0, 40);
    saveTitles({ ...parentState, title });
  };

  const onSubTopicChange = (event: React.ChangeEvent<{ value: string }>) => {
    const subTopic = event.target.value.substr(0, 40);
    saveTitles({ ...parentState, subTopic });
  };

  const onAltTopicChange = (event: React.ChangeEvent<{ value: string }>) => {
    const alternativeTopics = event.target.value.substr(0, 40);
    saveTitles({ ...parentState, alternativeTopics });
  };

  if (parentState.title) {
    setBrillderTitle(parentState.title);
  }

  return (
    <div className="tutorial-page brick-title-page">
      <Navigation step={ProposalStep.BrickTitle} onMove={() => saveTitles(parentState)} />
      <Grid container direction="row">
        <Grid item className="left-block">
          <div className="mobile-view-image">
            <img alt="titles" src="/images/new-brick/titles.png" />
          </div>
          <h1>What is your<br/>brick about?</h1>
          <Grid item className="input-container">
            <Input
              disabled={!canEdit}
              className="audience-inputs"
              value={parentState.title}
              onChange={(onTitleChange)}
              placeholder="Enter Proposed Title Here..."
            />
            <Input
              disabled={!canEdit}
              className="audience-inputs"
              value={parentState.subTopic}
              onChange={onSubTopicChange}
              placeholder="Enter Topic..."
            />
            <Input
              disabled={!canEdit}
              className="audience-inputs"
              value={parentState.alternativeTopics}
              onChange={onAltTopicChange}
              placeholder="Enter Subtopic(s)..."
            />
          </Grid>
          <div className="tutorial-pagination">
            <NextButton
              isActive={true}
              step={ProposalStep.BrickTitle}
              canSubmit={true}
              onSubmit={saveTitles}
              data={parentState}
            />
          </div>
          <h2 className="pagination-text">1 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={BrickTitlePreviewComponent} data={parentState} />
        <Hidden only={['xs','sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BrickTitle
