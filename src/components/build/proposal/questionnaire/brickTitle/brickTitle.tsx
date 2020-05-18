import React from "react";
import { Grid, Input } from "@material-ui/core";

import './brickTitle.scss';
import { ProposalStep } from "../../model";
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import NextButton from '../../components/nextButton';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import { Brick } from "model/brick";
import {getDate, getMonth, getYear} from 'components/services/brickService';

interface BrickTitleProps {
  parentState: Brick
  saveTitles(data: any):void
}

const BrickTitlePreviewComponent:React.FC<any> = (props) => {
  let {subTopic, alternativeTopics, title, author} = props.data;

  const date = new Date();
  const dateString = `${getDate(date)}.${getMonth(date)}.${getYear(date)}`;
  
  return (
    <Grid container alignContent="flex-start" className="brick-title-container">
      <Grid container justify="center">
        <img alt="titles" src="/images/new-brick/titles.png" className="titles-image" />
      </Grid>
      <div className="brick-preview-container">
        <div className={"brick-title " + (title ? 'topic-filled' : '')}>
          {title ? title : 'TITLE'}
        </div>
        <div className="brick-topics">
          <span className={subTopic ? 'topic-filled' : ''}>
            {subTopic ? subTopic : 'Topic'}
          </span> | <span className={alternativeTopics ? 'topic-filled' : ''}>
            {alternativeTopics ? alternativeTopics: 'Subtopic(s)'}
          </span>
        </div>
        <div className="author-row">
          {author.firstName ? author.firstName + ' ' + author.lastName : 'Author'}  | {dateString}
        </div>
      </div>
    </Grid>
  )
}


const BrickTitle:React.FC<BrickTitleProps> = ({ parentState, saveTitles }) => {
  const [titles, setTitles] = React.useState({
    title: parentState.title,
    subTopic: parentState.subTopic,
    alternativeTopics: parentState.alternativeTopics,
    author: {}
  });

  const onTitleChange = (event: React.ChangeEvent<{ value: string }>) => {
    const title = event.target.value.substr(0, 40);
    setTitles({ ...titles, title });
  };

  const onSubTopicChange = (event: React.ChangeEvent<{ value: string }>) => {
    const subTopic = event.target.value.substr(0, 40);
    setTitles({ ...titles, subTopic });
  };

  const onAltTopicChange = (event: React.ChangeEvent<{ value: string }>) => {
    const alternativeTopics = event.target.value.substr(0, 40);
    setTitles({ ...titles, alternativeTopics });
  };

  if (parentState.author) {
    titles.author = parentState.author;
  }

  return (
    <div className="tutorial-page brick-title-page">
      <HomeButton link='/build' />
      <Navigation step={ProposalStep.BrickTitle} />
      <Grid container direction="row">
        <Grid item className="left-block">
          <h1>What is your brick about?</h1>
          <Grid item className="input-container">
            <Input
              className="audience-inputs"
              value={titles.title}
              onChange={(onTitleChange)}
              placeholder="Enter Proposed Title Here..." />
            <Input
              className="audience-inputs"
              value={titles.subTopic}
              onChange={onSubTopicChange}
              placeholder="Enter Topic..." />
            <Input
              className="audience-inputs"
              value={titles.alternativeTopics}
              onChange={onAltTopicChange}
              placeholder="Enter Subtopic(s)..." />
          </Grid>
          <NextButton isActive={true} step={ProposalStep.BrickTitle} canSubmit={true} onSubmit={saveTitles} data={titles} />
        </Grid>
        <ProposalPhonePreview Component={BrickTitlePreviewComponent} data={titles} />
        <div className="red-right-block"></div>
        <div className="beta-text">BETA</div>
      </Grid>
    </div>
  );
}

export default BrickTitle
