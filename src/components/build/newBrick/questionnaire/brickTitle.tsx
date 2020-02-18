import React from "react";
import { Grid, Input } from "@material-ui/core";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";

import NextButton from '../components/nextButton'
import { NewBrickStep } from "../model";



function BrickTitle({parentState, saveTitles}: any) {
  const [titles, setTitles] = React.useState({
    title: parentState.title,
    subTopic: parentState.subTopic,
    alternativeTopics: parentState.alternativeTopics
  });

  const onTitleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTitles({...titles, title: event.target.value} as any);
  };

  const onSubTopicChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTitles({...titles, subTopic: event.target.value} as any);
  };

  const onAltTopicChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTitles({...titles, alternativeTopics: event.target.value} as any);
  };

  return (
    <div className="tutorial-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <div className="left-card">
            <h1 className="only-tutorial-header">Define and amplify your audience.</h1>
            <Input className="audience-inputs" value={titles.title} onChange={(onTitleChange)} placeholder="Enter Proposed Title Here..." />
            <Input className="audience-inputs" value={titles.subTopic} onChange={onSubTopicChange} placeholder="Enter Sub-Topic(s)..." />
            <Input className="audience-inputs" value={titles.alternativeTopics} onChange={onAltTopicChange} placeholder="Enter Alternative Topic(s)..." />
            <NextButton step={NewBrickStep.BrickTitle} canSubmit={true} onSubmit={saveTitles} data={titles} />
          </div>
        </Grid>
        <Hidden only={['xs', 'sm']}>
          <Grid container justify="center" item md={5} lg={4}>
            <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BrickTitle
