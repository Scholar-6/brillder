/*eslint no-useless-escape: "off"*/
import React from "react";
import { Grid } from "@material-ui/core";

import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import NextButton from '../../components/nextButton';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import PreviousButton from '../../components/previousButton';
import { ProposalStep } from "../../model";
import './brief.scss';


interface PrepProps {
  parentBrief: string;
  saveBrief(brief: string):void;
}

const BriefPreviewComponent:React.FC<any> = ({data}) => {
  if (data) {
    return (
      <Grid container justify="center" alignContent="flex-start" className="brief-phone-preview">
        <img
          alt="head"
          style={{width: 'auto', marginLeft: '0', marginTop: '9vh', height: '24%'}}
          src="/images/new-brick/brief-circles.png">
        </img>
        <div className="typing-text">{data}</div>
      </Grid>
    )
  }
  return (
    <Grid container justify="center" className="brief-phone-preview">
      <img
        alt="head"
        style={{width: 'auto', marginLeft: '0', marginTop: '6.8vh', height: '40%'}}
        src="/images/new-brick/brief-circles.png">
      </img>
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
      <HomeButton link='/build' />
      <Navigation step={ProposalStep.BrickTitle} />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid justify="center" item className="left-block">
          <h1 className="only-tutorial-header">
            Outline the purpose of this brick.
          </h1>
          <textarea
            value={brief}
            onChange={setBriefText}
            style={{ width: '90%', border: '2px solid black', height: '70px', fontSize: '1.2vw', textAlign: 'left' }}
            placeholder="Enter Brief Here..."
          />
          <PreviousButton to="/build/new-brick/open-question" />
          <NextButton step={ProposalStep.Brief} canSubmit={true} data={brief} onSubmit={saveBrief} />
        </Grid>
        <ProposalPhonePreview Component={BriefPreviewComponent} data={brief} />
        <div className="red-right-block"></div>
        <div className="beta-text">BETA</div>
      </Grid>
    </div>
  );
}

export default BriefComponent
