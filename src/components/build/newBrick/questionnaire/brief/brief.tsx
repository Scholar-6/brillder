/*eslint no-useless-escape: "off"*/
import React from "react";
import { Grid } from "@material-ui/core";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";

import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import { NewBrickStep } from "../../model";
import './brief.scss';


function BriefComponent({ parentState, saveBrief }: any) {
  const [brief, setBrief] = React.useState(parentState.preparationBrief);

  const setBriefText = (event: React.ChangeEvent<{ value: unknown }>) => {
    setBrief(event.target.value as string)
  }

  return (
    <div className="tutorial-page brief-prep-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <div className="left-card">
          <div style={{position: 'absolute', top: 0, right: 0, width: '100%', height: '100%'}}>
            <h1 className="only-tutorial-header">
              <p>Outline the purpose of this brick</p>
            </h1>
            <textarea
              value={brief}
              onChange={setBriefText}
              style={{ width: '90%', border: '2px solid black', height: '70px', fontSize: '1.2vw', textAlign: 'left' }}
              placeholder="Enter Brief Here..." />
            <PreviousButton to="/build/new-brick/open-question" />
            <NextButton step={NewBrickStep.Brief} canSubmit={true} data={brief} onSubmit={saveBrief} />
          </div>
        </div>
        <Hidden only={['xs', 'sm']}>
          <div style={{ right: "5%", position: "fixed", width: '19.3%', paddingTop: '33.3%' }}>
            <Device name="iphone-5s" use="iphone-5s" color="grey" url={window.location.origin + '/logo-page'} />
          </div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BriefComponent
