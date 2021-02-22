/*eslint no-useless-escape: "off"*/
import React from "react";
import * as Y from "yjs";
import { Grid, Hidden } from "@material-ui/core";

import './brief.scss';
import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import { ProposalStep, PlayButtonStatus, BrickLengthRoutePart } from "../../model";
import MathInHtml from 'components/play/baseComponents/MathInHtml';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import { toRenderJSON } from "services/SharedTypeService";


interface BriefProps {
  baseUrl: string;
  parentBrief: Y.Text;
  playStatus: PlayButtonStatus;
  canEdit: boolean;
  saveAndPreview(): void;
}

const BriefPreviewComponent: React.FC<any> = ({ data }) => {
  return (
    <Grid container justify="center" alignContent="flex-start" className="phone-preview-component">
      <SpriteIcon name="crosshair" className={data ? "" : "big"} />
      <div className="typing-text">
        <MathInHtml value={data} />
      </div>
    </Grid>
  );
}

const BriefComponent: React.FC<BriefProps> = ({ parentBrief, canEdit, ...props }) => {
  return (
    <div className="tutorial-page brief-page">
      <Navigation
        baseUrl={props.baseUrl}
        step={ProposalStep.Brief}
        playStatus={props.playStatus}
        saveAndPreview={props.saveAndPreview}
        onMove={() => {}}
      />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid className="left-block">
          <div className="mobile-view-image">
            <SpriteIcon name="crosshair" />
          </div>
          <h1>Outline the purpose of this brick.</h1>
          <QuillEditor
            disabled={!canEdit}
            sharedData={parentBrief}
            allowLinks={true}
            toolbar={[
              'bold', 'italic', 'fontColor', 'latex', 'bulletedList', 'numberedList'
            ]}
          />
          <NavigationButtons
            step={ProposalStep.Brief}
            canSubmit={true}
            data={parentBrief}
            onSubmit={() => {}}
            baseUrl={props.baseUrl}
            backLink={props.baseUrl + BrickLengthRoutePart}
          />
          <h2 className="pagination-text m-0">3 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={BriefPreviewComponent} data={toRenderJSON(parentBrief)} />
        <Hidden only={['xs', 'sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BriefComponent
