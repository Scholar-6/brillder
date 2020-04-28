import React from "react";
import { Grid } from "@material-ui/core";

import DocumentCKEditor from 'components/baseComponents/DocumentEditor';
import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import { ProposalStep } from "../../model";
import './prep.scss';


interface PrepProps {
  parentPrep: string;
  savePrep(prep: string):void;
}

const PrepPreviewComponent:React.FC<any> = ({data}) => {
  if (data) {
    return (
      <Grid container justify="center" alignContent="flex-start" className="prep-phone-preview">
        <img className="first-phone-image"
          alt="head"
          src="/images/new-brick/prep.png">
        </img>
        <div className="typing-text" dangerouslySetInnerHTML={{ __html: data}} />
      </Grid>
    )
  }
  return (
    <Grid container justify="center" alignContent="flex-start" className="prep-phone-preview">
      <img className="first-phone-image"
        alt="head"
        style={{height: '45%'}}
        src="/images/new-brick/prep.png">
      </img>
    </Grid>
  )
}

const PrepComponent: React.FC<PrepProps> = ({ parentPrep, savePrep }) => {
  let [prep, setPrep] = React.useState(parentPrep);

  return (
    <div className="tutorial-page prep-page">
      <HomeButton link='/build' />
      <Navigation step={ProposalStep.Prep} />
      <Grid container direction="row" alignItems="flex-start">
        <Grid className="left-block">
          <h1 className="tutorial-header">Add engaging and relevant</h1>
          <h1 className="tutorial-header">preparatory material.</h1>
          <DocumentCKEditor
            data={prep}
            placeholder="Enter Instructions, Links to Videos and Webpages Here…"
            onChange={setPrep}
          />
          <NextButton step={ProposalStep.Prep} canSubmit={true} data={prep} onSubmit={savePrep} />
          <PreviousButton to="/build/new-brick/brief" />
        </Grid>
        <ProposalPhonePreview Component={PrepPreviewComponent} data={prep} />
        <div className="red-right-block"></div>
        <div className="beta-text">BETA</div>
      </Grid>
    </div>
  );
}

export default PrepComponent
