import React from "react";
import { Grid, Input, Hidden } from "@material-ui/core";

import './EditorPage.scss';
import { Brick, Editor } from "model/brick";


interface EditorPageProps {
  brick: Brick;
  canEdit: boolean;
  saveEditor(editor?: Editor): void;
}

const EditorPage: React.FC<EditorPageProps> = ({ brick, canEdit, saveEditor }) => {
  const onEditorChange = (event: React.ChangeEvent<{ value: string }>) => {
    let editorId = parseInt(event.target.value);
    saveEditor({ id: isNaN(editorId) ? 0 : editorId });
  };

  return (
    <Grid container
      direction="column" 
      alignContent="center"
      justify="center"
      className="editor-page">
      <Grid item className="left-block">
        <h1>Who will edit your brick?</h1>
        <Grid item className="input-container">
          <Input
            disabled={!canEdit}
            className="audience-inputs"
            value={brick.editor?.id || ""}
            onChange={onEditorChange}
            placeholder="Enter editor's User ID here..."
            fullWidth
          />
        </Grid>
      </Grid>
      <Hidden only={['xs','sm']}>
        <div className="red-right-block"></div>
      </Hidden>
    </Grid>
  );
}

export default EditorPage
