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
    let value = event.target.value;
    let limit = 5;
    let values = event.target.value.replace(/\r\n/g,"\n").split("\n")
    if (values.length > limit) {
      value = values.slice(0, limit).join("\n")
    }
    setBrief(value)
  }

  return (
    <div className="tutorial-page brief-prep-page">
      <HomeButton link='/build' />
      <Navigation step={ProposalStep.Brief} />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid className="left-block">
          <h1 className="only-tutorial-header">
            Outline the purpose of this brick.
          </h1>
          <textarea
            value={brief}
            rows={4}
            onChange={setBriefText}
            placeholder="Enter Brief Here..."
          />
          <NextButton step={ProposalStep.Brief} canSubmit={true} data={brief} onSubmit={saveBrief} />
          <PreviousButton to="/build/new-brick/open-question" />
        </Grid>
        <ProposalPhonePreview Component={BriefPreviewComponent} data={brief} />
        <div className="red-right-block"></div>
        <div className="beta-text">BETA</div>
      </Grid>
    </div>
  );
}

export default BriefComponent
