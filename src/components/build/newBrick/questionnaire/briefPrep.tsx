import React from "react";
import { Grid, Input } from "@material-ui/core";
// @ts-ignore
import Device from "react-device-frame";
import { Hidden } from "@material-ui/core";

import NextButton from '../components/nextButton'
import { NewBrickStep } from "../model";
import './briefPrep.scss';

function BriefPrep({parentState, saveBriefPrep}:any) {
  const [state, setState] = React.useState({ links: '', preparationBrief: parentState.preparationBrief});

  const setBriefPrep = (event: React.ChangeEvent<{ value: unknown }>) => {
    setState({...state, preparationBrief: event.target.value} as any)
  }

  const setLinks = (event: React.ChangeEvent<{ value: unknown }>) => {
    setState({...state, links: event.target.value} as any)
  }

  return (
    <div className="tutorial-page brief-prep-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={7} lg={8}>
          <div className="left-card">
            <h1 className="only-tutorial-header">
              <p>What do you want users to get out of this brick?</p>
              <p>Enter Brief and links to any Preparatory Materials.</p>
            </h1>
            <input
              value={state.preparationBrief}
              onChange={setBriefPrep}
              style={{ width: '90%', border: '2px solid black', height: '70px', textAlign: 'center' }}
              placeholder="Enter Brief here..."></input>
            <Input
              value={state.links}
              onChange={setLinks}
              style={{ margin: '20px 0 0 0', width: '90%' }}
              placeholder="Insert Link(s) Here..." />

            <Grid container direction="row" alignItems="center" style={{ height: "300px" }}>
              <Grid container justify="center" item xs={3}>
                <h1>Video / Text Preview</h1>
              </Grid>
              <Grid container justify="center" item xs={9}>
                <div style={{ height: "250px", width: "90%", border: "1px solid black" }}>
                  <Grid container direction="row" alignItems="center" style={{ height: "100%" }}>
                    <Grid container justify="center" item xs={12}>
                      <iframe width="420" height="315"
                        title="Video Preview"
                        src={state.links.split(' ')[0]}>
                      </iframe>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
            <NextButton step={NewBrickStep.BriefPrep} canSubmit={true} onSubmit={saveBriefPrep} data={state} />
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

export default BriefPrep
