import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import './prep.scss';
import { ProposalStep, PlayButtonStatus } from "../../model";
import map from 'components/map';

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/proposal/components/navigation/Navigation';
import YoutubeAndMath from 'components/play/baseComponents/YoutubeAndMath';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import QuillEditor from "components/baseComponents/quill/QuillEditor";


interface PrepProps {
  parentPrep: string;
  canEdit: boolean;
  playStatus: PlayButtonStatus;
  savePrep(prep: string): void;
  saveBrick(prep: string): void;
  saveAndPreview(): void;
}

const PrepPreviewComponent: React.FC<any> = ({ data }) => {
  return (
    <Grid container justify="center" alignContent="flex-start" className="phone-preview-component">
      <SpriteIcon name="file-text" className={data ? "" : "big"} />
      <div className="typing-text">
        <YoutubeAndMath value={data} />
      </div>
    </Grid>
  );
}

const PrepComponent: React.FC<PrepProps> = ({ parentPrep, savePrep, ...props }) => {
  return (
    <div className="tutorial-page prep-page-questionary">
      <Navigation
        step={ProposalStep.Prep}
        playStatus={props.playStatus}
        saveAndPreview={props.saveAndPreview}
        onMove={() => savePrep(parentPrep)}
      />
      <Grid container direction="row" alignItems="flex-start">
        <Grid className="left-block">
          <div className="mobile-view-image">
            <img className="size2" alt="titles" src="/images/new-brick/prep.png" />
          </div>
          <h1>Add engaging and relevant <br /> preparatory material.</h1>
          <QuillEditor
            disabled={!props.canEdit}
            data={parentPrep}
            allowMediaEmbed={true}
            allowLinks={true}
            toolbar={[
              'bold', 'italic', 'fontColor', 'latex', 'bulletedList', 'numberedList', 'image'
            ]}
            onChange={savePrep}
          />
          <NavigationButtons
            step={ProposalStep.Prep}
            canSubmit={true}
            data={parentPrep}
            onSubmit={props.saveBrick}
            backLink={map.ProposalBrief}
          />
          <h2 className="pagination-text">4 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={PrepPreviewComponent} data={parentPrep} />
        <Hidden only={['xs', 'sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default PrepComponent
