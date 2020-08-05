import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import './prep.scss';
import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import { ProposalStep } from "../../model";
import YoutubeAndMath from 'components/play/brick/baseComponents/YoutubeAndMath';
import map from 'components/map';


interface PrepProps {
  parentPrep: string;
  canEdit: boolean;
  savePrep(prep: string): void;
}

const PrepPreviewComponent: React.FC<any> = ({ data }) => {
  if (data) {
    return (
      <Grid container justify="center" alignContent="flex-start" className="phone-preview-component">
        <img className="first-phone-image"
          alt="head"
          src="/images/new-brick/prep.png">
        </img>
        <div className="typing-text">
          <YoutubeAndMath value={data} />
        </div>
      </Grid>
    )
  }
  return (
    <Grid container justify="center" alignContent="flex-start" className="phone-preview-component">
      <img className="first-phone-image"
        alt="head"
        style={{ height: '45%' }}
        src="/images/new-brick/prep.png">
      </img>
    </Grid>
  )
}

const PrepComponent: React.FC<PrepProps> = ({ parentPrep, canEdit, savePrep }) => {
  return (
    <div className="tutorial-page prep-page">
      <Navigation step={ProposalStep.Prep} onMove={() => savePrep(parentPrep)} />
      <Grid container direction="row" alignItems="flex-start">
        <Grid className="left-block">
          <div className="mobile-view-image">
            <img className="size2" alt="titles" src="/images/new-brick/prep.png" />
          </div>
          <h1>Add engaging and relevant <br /> preparatory material.</h1>
          <DocumentWirisCKEditor
            disabled={!canEdit}
            data={parentPrep}
            placeholder="Enter Instructions, Links to Videos and Webpages Here…"
            mediaEmbed={true}
            toolbar={[
              'bold', 'italic', 'fontColor', 'mathType', 'chemType', 'bulletedList', 'numberedList'
            ]}
            onBlur={() => { }}
            onChange={savePrep}
          />
          <NavigationButtons
            step={ProposalStep.Prep}
            canSubmit={true}
            data={parentPrep}
            onSubmit={savePrep}
            backLink={map.ProposalBrief}
          />
          <h2 className="pagination-text">4 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={PrepPreviewComponent} data={parentPrep} />
        <Hidden only={['xs','sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default PrepComponent
