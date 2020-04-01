import React from "react";
import { Grid, Input } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

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

  const getYear = (date: Date) => {
    var currentYear =  date.getFullYear();   
    var twoLastDigits = currentYear%100;
    var formatedTwoLastDigits = "";
    
    if (twoLastDigits <10 ) {
      formatedTwoLastDigits = "0" + twoLastDigits;
    } else {
      formatedTwoLastDigits = "" + twoLastDigits;
    }
    return formatedTwoLastDigits;
  }

  const getMonth = (date: Date) => {
    const month = date.getMonth() + 1;
    var twoLastDigits = month%10;
    var formatedTwoLastDigits = "";

    if (twoLastDigits < 10 ) {
      formatedTwoLastDigits = "0" + twoLastDigits;
    } else {
      formatedTwoLastDigits = "" + twoLastDigits;
    }
    return formatedTwoLastDigits;
  }

  const date = new Date();
  const dateString = `${date.getDate()}.${getMonth(date)}.${getYear(date)}`;
  
  return (
    <Grid container alignContent="flex-start" className="brick-title-container">
      <div className="search-container">
        <Grid container alignContent="center" style={{height: '100%', position:'relative'}}>
          Search
          <SearchIcon className="fake-loop"/>
        </Grid>
      </div>
      <div className="brick-preview-container">
        <div className="brick-title" style={{color: title ? '#D8D2CE' : ''}}>
          {title ? title : 'Title'}
        </div>
        <div style={{height: '0.9vw', overflow: 'hidden'}}>
          <span style={{color: subTopic ? '#D8D2CE' : ''}}>
            {subTopic ? subTopic : 'Topic'}
          </span> | <span style={{color: alternativeTopics ? '#D8D2CE' : ''}}>
            {alternativeTopics ? alternativeTopics: 'SubTopic'}
          </span>
        </div>
        <div>Author | <span style={{color: '#D8D2CE'}}>{dateString}</span></div>
        <div className="brick-right-button">
          <Grid container alignContent="flex-end" style={{height: '100%'}}>
            <span className="fake-expand">+</span>
          </Grid>
        </div>
      </div>
      <div className="brick-fake-preview-container brick-container-2">
        <div className="brick-right-button">
        </div>
      </div>
      <div className="brick-fake-preview-container brick-container-3">
        <div className="brick-right-button">
        </div>
      </div>
      <div className="brick-fake-preview-container brick-container-4">
        <div className="brick-right-button">
        </div>
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
                <Input className="audience-inputs" value={titles.subTopic} onChange={onSubTopicChange} placeholder="Enter Sub-Topic(s)..." />
                <Input className="audience-inputs" value={titles.alternativeTopics} onChange={onAltTopicChange} placeholder="Enter Alternative Topic(s)..." />
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
