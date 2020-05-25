/*eslint no-useless-escape: "off"*/
import React from "react";
import { Grid } from "@material-ui/core";

import './brief.scss';
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import { ProposalStep } from "../../model";
import DocumentCKEditor from "components/baseComponents/DocumentEditor";
import MathInHtml from 'components/play/brick/baseComponents/MathInHtml';


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
        <div className="typing-text">
          <MathInHtml value={data} />
        </div>
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
  const setBriefText = (value: string) => {
    saveBrief(value)
  }

  return (
    <div className="tutorial-page brief-page">
      <HomeButton link='/build' />
      <Navigation step={ProposalStep.Brief} onMove={() => saveBrief(parentBrief)} />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid className="left-block">
          <h1 className="only-tutorial-header">
            Outline the purpose of this brick.
          </h1>
          <DocumentCKEditor
            data={parentBrief}
            placeholder="Enter Brief Here..."
            toolbar={[
              'bold', 'italic', 'fontColor', 'mathType', 'chemType', 'bulletedList', 'numberedList'
            ]}
            onBlur={() => {}}
            onChange={setBriefText}
          />
          <NavigationButtons
            step={ProposalStep.Brief}
            canSubmit={true}
            data={parentBrief}
            onSubmit={saveBrief}
            backLink="/build/new-brick/open-question"
          />
        </Grid>
        <ProposalPhonePreview Component={BriefPreviewComponent} data={parentBrief} />
        <div className="red-right-block"></div>
        <div className="beta-text">BETA</div>
      </Grid>
    </div>
  );
}

export default BriefComponent
