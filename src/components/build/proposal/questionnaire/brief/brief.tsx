/*eslint no-useless-escape: "off"*/
import React from "react";
import { Grid, Hidden } from "@material-ui/core";

import './brief.scss';
import NavigationButtons from '../../components/navigationButtons/NavigationButtons';
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import { ProposalStep } from "../../model";
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';
import MathInHtml from 'components/play/brick/baseComponents/MathInHtml';
import map from 'components/map';


interface BriefProps {
  parentBrief: string;
  canEdit: boolean;
  saveBrief(brief: string): void;
}

const BriefPreviewComponent: React.FC<any> = ({ data }) => {
  if (data) {
    return (
      <Grid container justify="center" alignContent="flex-start" className="phone-preview-component">
        <img
          alt="head"
          className="first-phone-image"
          src="/images/new-brick/brief-circles.png"
        >
        </img>
        <div className="typing-text">
          <MathInHtml value={data} />
        </div>
      </Grid>
    )
  }
  return (
    <Grid container justify="center" className="phone-preview-component">
      <img
        alt="head"
        className="first-phone-image"
        style={{ height: '40%' }}
        src="/images/new-brick/brief-circles.png">
      </img>
    </Grid>
  )
}

const BriefComponent: React.FC<BriefProps> = ({ parentBrief, canEdit, saveBrief }) => {
  const setBriefText = (value: string) => {
    saveBrief(value)
  }

  return (
    <div className="tutorial-page brief-page">
      <Navigation step={ProposalStep.Brief} onMove={() => saveBrief(parentBrief)} />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid className="left-block">
          <div className="mobile-view-image">
            <img alt="titles" src="/images/new-brick/brief-circles.png" />
          </div>
          <h1 className="only-tutorial-header">
            Outline the purpose of this brick.
          </h1>
          <DocumentWirisCKEditor
            disabled={!canEdit}
            data={parentBrief}
            placeholder="Enter Brief Here..."
            toolbar={[
              'bold', 'italic', 'fontColor', 'mathType', 'chemType', 'bulletedList', 'numberedList'
            ]}
            onBlur={() => { }}
            onChange={setBriefText}
          />
          <NavigationButtons
            step={ProposalStep.Brief}
            canSubmit={true}
            data={parentBrief}
            onSubmit={saveBrief}
            backLink={map.ProposalOpenQuestion}
          />
          <h2 className="pagination-text m-0">3 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={BriefPreviewComponent} data={parentBrief} />
        <Hidden only={['xs','sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BriefComponent
