/*eslint no-useless-escape: "off"*/
import React from "react";
import { Grid, Input } from "@material-ui/core";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";

import NextButton from '../components/nextButton';
import PreviousButton from '../components/previousButton';
import { NewBrickStep } from "../model";
import './brief.scss';


function BriefComponent({ parentState, setBrief }: any) {
  const [state, setState] = React.useState({ links: '', preparationBrief: parentState.preparationBrief });

  const setBriefText = (event: React.ChangeEvent<{ value: unknown }>) => {
    setState({ ...state, preparationBrief: event.target.value } as any)
  }

  return (
    <div className="tutorial-page brief-prep-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <div className="left-card">
            <h1 className="only-tutorial-header">
              <p>Outline the purpose of this brick</p>
            </h1>
            <textarea
              value={state.preparationBrief}
              onChange={setBriefText}
              style={{ width: '90%', border: '2px solid black', height: '70px', fontSize: '1.2vw', textAlign: 'left' }}
              placeholder="Enter Brief Here..." />
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="flex-start"
              className="tutorial-next-container"
            >
              <PreviousButton to="/build/new-brick/open-question" />
              <Grid container justify="flex-end" item xs={6}>
                <NextButton step={NewBrickStep.Brief} canSubmit={true} data={state} />
              </Grid>
            </Grid>
          </div>
        </Grid>
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
