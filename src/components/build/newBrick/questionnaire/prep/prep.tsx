/*eslint no-useless-escape: "off"*/
import React from "react";
import { Grid } from "@material-ui/core";

import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import { NewBrickStep } from "../../model";
import './prep.scss';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";

function PrepComponent({ parentState, setPrep }: any) {
  const [state, setState] = React.useState({ prep: '' });

  const setPrepLinks = (event: React.ChangeEvent<{ value: unknown }>) => {
    setState({ ...state, prep: event.target.value as string } as any)
  }

  return (
    <div className="tutorial-page prep-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container item xs={6} justify="center">
          <Grid container item xs={8}>
            <div className="left-card">
              <h1 className="only-tutorial-header">
                <p>Prep</p>
              </h1>
              <textarea
                value={state.prep}
                onChange={setPrepLinks}
                style={{ width: '90%', border: '2px solid black', height: '70px', fontSize: '1.2vw', textAlign: 'left' }}
                placeholder="Enter Prep Here..." />
              <PreviousButton to="/build/new-brick/brief" />
              <NextButton step={NewBrickStep.Prep} canSubmit={true} data={state} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview link={window.location.origin + '/logo-page'} />
      </Grid>
    </div>
  );
}

export default PrepComponent
