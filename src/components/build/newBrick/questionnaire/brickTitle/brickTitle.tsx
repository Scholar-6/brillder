import React from "react";
import { Grid, Input } from "@material-ui/core";

import './brickTitle.scss';
import { NewBrickStep } from "../../model";
import ExitButton from '../../components/ExitButton';
import NextButton from '../../components/nextButton'
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import { Brick } from "model/brick";


interface BrickTitleProps {
  parentState: Brick
  saveTitles(data: any):void
}

const BrickTitlePreviewComponent:React.FC<any> = (props) => {
  let {subTopic, alternativeTopics, title} = props.data;

  const formatTwoLastDigits = (twoLastDigits: number) => {
    var formatedTwoLastDigits = "";
    if (twoLastDigits < 10 ) {
      formatedTwoLastDigits = "0" + twoLastDigits;
    } else {
      formatedTwoLastDigits = "" + twoLastDigits;
    }
    return formatedTwoLastDigits;
  }

  const getYear = (date: Date) => {
    var currentYear =  date.getFullYear();   
    var twoLastDigits = currentYear%100;
    return formatTwoLastDigits(twoLastDigits);
  }

  const getMonth = (date: Date) => {
    const month = date.getMonth() + 1;
    var twoLastDigits = month%10;
    return formatTwoLastDigits(twoLastDigits);
  }

  const getDate = (date: Date) => {
    const days = date.getDate();
    return formatTwoLastDigits(days);
  }

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
        <div className="author-row">Author | {dateString}</div>
      </div>
    </Grid>
  )
}


const BrickTitle:React.FC<BrickTitleProps> = ({ parentState, saveTitles }) => {
  const [titles, setTitles] = React.useState({
    title: parentState.title,
    subTopic: parentState.subTopic,
    alternativeTopics: parentState.alternativeTopics
  });

  const onTitleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTitles({ ...titles, title: event.target.value } as any);
  };

  const onSubTopicChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTitles({ ...titles, subTopic: event.target.value } as any);
  };

  const onAltTopicChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTitles({ ...titles, alternativeTopics: event.target.value } as any);
  };

  return (
    <div className="tutorial-page brick-title-page">
      <ExitButton />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={8} lg={8}>
          <Grid justify="center" container item xs={12} sm={9} md={7} lg={7}>
            <div className="left-card">
              <h1 className="only-tutorial-header">What is your brick about?</h1>
              <Grid container justify="center" item xs={12}>
                <Input className="audience-inputs" value={titles.title} onChange={(onTitleChange)} placeholder="Enter Proposed Title Here..." />
                <Input className="audience-inputs" value={titles.subTopic} onChange={onSubTopicChange} placeholder="Enter Topic(s)..." />
                <Input className="audience-inputs" value={titles.alternativeTopics} onChange={onAltTopicChange} placeholder="Enter Subtopic(s)..." />
              </Grid>
              <p className="page-number">1 of 4</p>
              <NextButton step={NewBrickStep.BrickTitle} canSubmit={true} onSubmit={saveTitles} data={titles} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview Component={BrickTitlePreviewComponent} data={titles} />
      </Grid>
    </div>
  );
}

export default BrickTitle
