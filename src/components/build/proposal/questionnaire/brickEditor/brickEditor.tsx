import React from "react";
import { Grid, Input, Hidden } from "@material-ui/core";

import './brickEditor.scss';
import { ProposalStep } from "../../model";
import ProposalPhonePreview from "components/build/baseComponents/phonePreview/proposalPhonePreview/ProposalPhonePreview";
import Navigation from 'components/build/proposal/components/navigation/Navigation';
import { Brick, Editor } from "model/brick";
import { getDate, getMonth, getYear } from 'components/services/brickService';
import { setBrillderTitle } from "components/services/titleService";
import NavigationButtons from "../../components/navigationButtons/NavigationButtons";


interface BrickTitleProps {
  parentState: Brick;
  canEdit: boolean;
  setEditor(editor?: Editor): void;
}

const BrickEditorPreviewComponent: React.FC<any> = (props) => {
  const { editor } = props.data;

  const date = new Date();
  const dateString = `${getDate(date)}.${getMonth(date)}.${getYear(date)}`;

  if (!editor) {
    return (
      <Grid container alignContent="flex-start" className="phone-preview-component title">
        <Grid container justify="center">
          <img alt="editor" src="/images/new-brick/edit.png" className="titles-image big" />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container alignContent="flex-start" className="phone-preview-component title">
      <Grid container justify="center">
        <img alt="editor" src="/images/new-brick/edit.png" className="titles-image" />
      </Grid>
      <div className="brick-preview-container">
        <div className={"brick-title uppercase " + (editor ? 'topic-filled' : '')}>
          Edited by {editor.id}
        </div>
      </div>
    </Grid>
  )
}


const BrickEditor: React.FC<BrickTitleProps> = ({ parentState, canEdit, setEditor: saveEditor }) => {
  const onEditorChange = (event: React.ChangeEvent<{ value: string }>) => {
    let editorId = parseInt(event.target.value);
    saveEditor({ id: isNaN(editorId) ? 0 : editorId });
  };

  return (
    <div className="tutorial-page brick-title-page">
      <Navigation step={ProposalStep.BrickEditor} onMove={() => saveEditor(parentState.editor)} />
      <Grid container direction="row">
        <Grid item className="left-block">
          <div className="mobile-view-image">
            <img alt="titles" src="/images/new-brick/titles.png" />
          </div>
          <h1>Who will edit<br/>your brick?</h1>
          <Grid item className="input-container">
            <Input
              disabled={!canEdit}
              className="audience-inputs"
              value={parentState.editor?.id || ""}
              onChange={(onEditorChange)}
              placeholder="Enter editor's User ID here..."
            />
          </Grid>
          <NavigationButtons
            step={ProposalStep.BrickEditor}
            canSubmit={parentState.editor !== undefined}
            onSubmit={saveEditor}
            data={parentState.editor}
            backLink="/build/new-brick/length"
          />
          <h2 className="pagination-text">1 of 4</h2>
        </Grid>
        <ProposalPhonePreview Component={BrickEditorPreviewComponent} data={parentState} />
        <Hidden only={['xs','sm']}>
          <div className="red-right-block"></div>
        </Hidden>
      </Grid>
    </div>
  );
}

export default BrickEditor
