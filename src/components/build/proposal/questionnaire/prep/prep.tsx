import React from "react";
import * as Y from "yjs";
import { Grid, Hidden } from "@material-ui/core";

import './prep.scss';
import { ProposalStep, PlayButtonStatus, BriefRoutePart } from "../../model";

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import YoutubeAndMathQuote from 'components/play/baseComponents/YoutubeAndMathQuote';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import { toRenderJSON } from "services/SharedTypeService";


interface PrepProps {
  parentPrep: Y.Text;
  canEdit: boolean;
  baseUrl: string;
  playStatus: PlayButtonStatus;
  saveAndPreview(): void;
}

const PrepPreviewComponent: React.FC<any> = ({ data }) => {
  return (
    <Grid container justify="center" alignContent="flex-start" className="phone-preview-component">
      <SpriteIcon name="file-text" className={data ? "" : "big"} />
      <div className="typing-text">
        <YoutubeAndMathQuote value={data} isSynthesisParser={true} />
      </div>
    </Grid>
  );
}

const PrepComponent: React.FC<PrepProps> = ({ parentPrep, ...props }) => {
  return (
    <div className="tutorial-page prep-page-questionary">
      <Navigation
        step={ProposalStep.Prep}
        baseUrl={props.baseUrl}
        playStatus={props.playStatus}
        saveAndPreview={props.saveAndPreview}
        onMove={() => {}}
      />
      <Grid container direction="row" alignItems="flex-start">
        <Grid className="left-block">
          <div className="mobile-view-image">
            <img className="size2" alt="titles" src="/images/new-brick/prep.png" />
          </div>
          <h1>Add engaging and relevant <br /> preparatory material.</h1>
          <QuillEditor
            disabled={!props.canEdit}
            sharedData={parentPrep}
            allowMediaEmbed={true}
            allowLinks={true}
            toolbar={[
              'bold', 'italic', 'fontColor', 'latex', 'bulletedList', 'numberedList', 'image'
            ]}
          />
          <NavigationButtons
            step={ProposalStep.Prep}
            canSubmit={true}
            data={parentPrep}
            onSubmit={() => {}}
            backLink={props.baseUrl + BriefRoutePart}
            baseUrl={props.baseUrl}
          />
          <h2 className="pagination-text">4 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={PrepPreviewComponent} data={toRenderJSON(parentPrep)} />
        <Hidden only={['xs', 'sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default PrepComponent
