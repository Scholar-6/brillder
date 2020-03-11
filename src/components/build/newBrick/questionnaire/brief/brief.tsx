/*eslint no-useless-escape: "off"*/
import React from "react";
import { Grid } from "@material-ui/core";

import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import { NewBrickStep } from "../../model";
import './brief.scss';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";


interface PrepProps {
  parentBrief: string;
  saveBrief(brief: string):void;
}

const BriefComponent: React.FC<PrepProps> = ({ parentBrief, saveBrief }) => {
  const [brief, setBrief] = React.useState(parentBrief);

  const setBriefText = (event: React.ChangeEvent<{ value: string }>) => {
    setBrief(event.target.value)
  }

  return (
    <div className="tutorial-page brief-prep-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={8} lg={8}>
          <Grid justify="center" container item xs={12} sm={9} md={10} lg={7}>
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
