/*eslint no-useless-escape: "off"*/
import React from "react";
import { Grid } from "@material-ui/core";

import ExitButton from '../../components/ExitButton';
import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import { NewBrickStep } from "../../model";
import './brief.scss';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";


interface PrepProps {
  parentBrief: string;
  saveBrief(brief: string):void;
}

function BriefPreviewComponent() {
  return (
    <Grid container justify="center" style={{width: '100%', height: '100%', background: '#001D55'}}>
      <img
        alt="head"
        style={{width: 'auto', marginLeft: '0', marginTop: '6.8vh', height: '27.5%'}}
        src="/images/new-brick/brief-circles.png">
      </img>
      <p style={{fontSize: '1.25vw', color: 'white', fontFamily: 'Brandon Grotesque Regular', margin: 0, marginBottom: '3vh'}}>
        Lorem ipsum dolor sit amet,
        <br></br>
        consetetur sadipscing elitr, sed
        <br></br>
        diam nonumy eirmod tempor
        <br></br>
        invidunt ut labore et dolore
        <br></br>
        magna aliquyam erat, sed diam
      </p>
    </Grid>
  )
}

const BriefComponent: React.FC<PrepProps> = ({ parentBrief, saveBrief }) => {
  const [brief, setBrief] = React.useState(parentBrief);

  const setBriefText = (event: React.ChangeEvent<{ value: string }>) => {
    setBrief(event.target.value)
  }

  return (
    <div className="tutorial-page brief-prep-page">
      <ExitButton />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={8} lg={8}>
          <Grid justify="center" container item xs={12} sm={9} md={7} lg={7}>
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
              <p className="page-number">3 of 6</p>
              <NextButton step={NewBrickStep.Brief} canSubmit={true} data={brief} onSubmit={saveBrief} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview Component={BriefPreviewComponent} />
      </Grid>
    </div>
  );
}

export default BriefComponent
