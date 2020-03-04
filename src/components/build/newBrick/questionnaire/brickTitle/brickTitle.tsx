import React from "react";
import { Grid, Input } from "@material-ui/core";

import NextButton from '../../components/nextButton'
import { NewBrickStep } from "../../model";
import './brickTitle.scss';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";


function BrickTitle({ parentState, saveTitles }: any) {
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
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container item xs={8} justify="center">
          <Grid container item xs={8}>
            <div className="left-card">
              <h1 className="only-tutorial-header">What is your brick about?</h1>
              <Grid container justify="center" item xs={12}>
                <Input className="audience-inputs" value={titles.title} onChange={(onTitleChange)} placeholder="Enter Proposed Title Here..." />
                <Input className="audience-inputs" value={titles.subTopic} onChange={onSubTopicChange} placeholder="Enter Sub-Topic(s)..." />
                <Input className="audience-inputs" value={titles.alternativeTopics} onChange={onAltTopicChange} placeholder="Enter Alternative Topic(s)..." />
              </Grid>
              <NextButton step={NewBrickStep.BrickTitle} canSubmit={true} onSubmit={saveTitles} data={titles} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview link={window.location.origin + '/logo-page'} />
      </Grid>
    </div>
  );
}

export default BrickTitle
