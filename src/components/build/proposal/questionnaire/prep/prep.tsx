import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import './prep.scss';
import { ProposalStep, BriefRoutePart } from "../../model";

import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import YoutubeAndMathQuote from 'components/play/baseComponents/YoutubeAndMathQuote';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { BrickLengthEnum } from "model/brick";
import QuillEditor from "components/baseComponents/quill/QuillEditor";


interface PrepProps {
  parentPrep: string;
  canEdit: boolean;
  baseUrl: string;
  updated: string;
  brickLength: BrickLengthEnum;
  savePrep(prep: string): void;
  saveBrick(prep: string): void;
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

const PrepComponent: React.FC<PrepProps> = ({ parentPrep, savePrep, ...props }) => {
  const isVisible = () => {
    if (props.brickLength) {
      if (props.brickLength === BrickLengthEnum.S20min) {
        return true;
      } else if (props.brickLength === BrickLengthEnum.S40min) {
        return true;
      } else if (props.brickLength === BrickLengthEnum.S60min) {
        return true;
      }
    }
    return false;
  }

  const getPrepLength = () => {
    if (props.brickLength) {
      if (props.brickLength === BrickLengthEnum.S20min) {
        return 5;
      } else if (props.brickLength === BrickLengthEnum.S40min) {
        return 10;
      } else if (props.brickLength === BrickLengthEnum.S60min) {
        return 15;
      }
    }
  }

  return (
    <div className="tutorial-page prep-page-questionary">
      <Navigation
        step={ProposalStep.Prep}
        baseUrl={props.baseUrl}
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
            showToolbar={true}
            allowMediaEmbed={true}
            allowLinks={true}
            imageDialog={true}
            placeholder="Enter Instructions, Links to Videos and Webpages Here…"
            toolbar={[
              'bold', 'italic', 'fontColor', 'latex', 'bulletedList', 'numberedList', 'blockQuote', 'image'
            ]}
            onChange={savePrep}
          />
          {isVisible() &&
            <div className="prep-bottom-help-text">
              This should take the student no longer than {getPrepLength()} minutes in total
            </div>
          }
          <NavigationButtons
            step={ProposalStep.Prep}
            canSubmit={true}
            data={parentPrep}
            onSubmit={props.saveBrick}
            backLink={props.baseUrl + BriefRoutePart}
            baseUrl={props.baseUrl}
          />
          <h2 className="pagination-text">4 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={PrepPreviewComponent} data={parentPrep} updated={props.updated} />
        <Hidden only={['xs', 'sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default PrepComponent
