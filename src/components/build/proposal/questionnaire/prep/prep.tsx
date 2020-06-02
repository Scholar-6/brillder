import React from "react";
import { Grid } from "@material-ui/core";

import './prep.scss';
import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import { ProposalStep } from "../../model";
import MathInHtml from 'components/play/brick/baseComponents/MathInHtml';


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
        <div className="typing-text">
          <MathInHtml value={data} />
        </div>
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
  return (
    <div className="tutorial-page prep-page">
      <Navigation step={ProposalStep.Prep} onMove={() => savePrep(parentPrep)} />
      <Grid container direction="row" alignItems="flex-start">
        <Grid className="left-block">
          <h1>Add engaging and relevant</h1>
          <h1>preparatory material.</h1>
          <DocumentWirisCKEditor
            data={parentPrep}
            placeholder="Enter Instructions, Links to Videos and Webpages Here…"
            mediaEmbed={true}
            toolbar={[
              'bold', 'italic', 'fontColor', 'mathType', 'chemType', 'bulletedList', 'numberedList'
            ]}
            onBlur={() => {}}
            onChange={savePrep}
          />
          <NavigationButtons
            step={ProposalStep.Prep}
            canSubmit={true}
            data={parentPrep}
            onSubmit={savePrep}
            backLink="/build/new-brick/brief"
          />
        </Grid>
        <ProposalPhonePreview Component={PrepPreviewComponent} data={parentPrep} />
        <div className="red-right-block"></div>
      </Grid>
    </div>
  );
}

export default PrepComponent
