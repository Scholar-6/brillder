/*eslint no-useless-escape: "off"*/
import React from "react";
import { Grid } from "@material-ui/core";

import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import { NewBrickStep } from "../../model";
import './brief.scss';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";


function BriefComponent({ parentState, saveBrief }: any) {
  const [brief, setBrief] = React.useState(parentState.preparationBrief);

  const setBriefText = (event: React.ChangeEvent<{ value: unknown }>) => {
    setBrief(event.target.value as string)
  }

  return (
    <div className="tutorial-page brief-prep-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container item xs={8} justify="center">
          <Grid container item xs={8}>
            <div className="left-card">
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
          </Grid>
        </Grid>
        <PhonePreview link={window.location.origin + '/logo-page'} />
      </Grid>
    </div>
  );
}

export default BriefComponent
