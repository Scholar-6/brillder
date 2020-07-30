import React from "react";
import { Grid, TextField, Hidden, Fab, SvgIcon } from "@material-ui/core";
import sprite from "assets/img/icons-sprite.svg";

import './EditorPage.scss';
import { Brick, Editor } from "model/brick";


interface EditorPageProps {
  brick: Brick;
  canEdit: boolean;
  history: any;
  saveEditor(editor?: Editor): void;
}

const EditorPage: React.FC<EditorPageProps> = ({ brick, canEdit, saveEditor, history }) => {
  const [editorIdString, setEditorIdString] = React.useState(brick.editor?.id ?? "");
  
  const editorIdValid = !isNaN(parseInt(editorIdString.toString()));

  const onNext = () => {
    if(editorIdValid) {
      let editorId = parseInt(editorIdString.toString());
      saveEditor({ id: editorId });
      history.push(`/play-preview/brick/${brick.id}/finish`);
    }
  };

  return (
    <Grid container
      direction="row" 
      alignContent="center"
      justify="center"
      className="editor-page"
      spacing={4}>
      <Grid item className="left-block">
        <h1>Who will edit your brick?</h1>
        <Grid item className="input-container">
          <TextField
            disabled={!canEdit}
            className="audience-inputs"
            value={editorIdString}
            onChange={(evt) => setEditorIdString(evt.target.value)}
            placeholder="Enter editor's User ID here..."
            error={!editorIdValid}
            helperText={editorIdValid ? "" : "Invalid ID"}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid item>
        <div>
          <Fab onClick={onNext} color="primary">
            <SvgIcon>
              <svg className="svg w80 h80 active m-l-02">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#arrow-right"} />
              </svg>
            </SvgIcon>
          </Fab>
        </div>
      </Grid>
      <Hidden only={['xs','sm']}>
        <div className="red-right-block"></div>
      </Hidden>
    </Grid>
  );
}

export default EditorPage
