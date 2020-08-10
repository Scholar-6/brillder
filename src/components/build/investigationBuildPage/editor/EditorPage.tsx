import React from "react";
import axios from "axios";
import { Grid, TextField, Hidden, Fab, SvgIcon } from "@material-ui/core";
import sprite from "assets/img/icons-sprite.svg";

import './EditorPage.scss';
import { Brick/*, Editor*/ } from "model/brick";


interface EditorPageProps {
  brick: Brick;
  canEdit: boolean;
  history: any;
  saveEditor(editorId: number): void;
}

const EditorPage: React.FC<EditorPageProps> = ({ brick, canEdit, saveEditor, history }) => {
  const [editorUsername, setEditorUsername] = React.useState(brick.editor?.username ?? "");
  const [editor, setEditor] = React.useState(brick.editor);
  const [editorError, setEditorError] = React.useState("");

  const onNext = () => {
    if(editor) {
      saveEditor(editor.id);
    }
  };

  const onBlur = () => {
    if(editorUsername !== "") {
      try {
        axios.get(
          `${process.env.REACT_APP_BACKEND_HOST}/user/byUsername/${editorUsername}`,
          { withCredentials: true }
        ).then(response => {
          setEditor(response.data);
          setEditorError("");
        }).catch(error => {
          setEditorError(error.response.data);
        });
      } catch(e) {
        console.log(e);
      }
    } else {
      setEditorError("No username input.");
    }
  }

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
            value={editorUsername}
            onChange={(evt) => setEditorUsername(evt.target.value)}
            onBlur={(evt) => onBlur()}
            placeholder="Enter editor's username here..."
            error={editorError !== ""}
            helperText={editorError}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid item>
        <div>
          <Fab onClick={onNext} color="primary" disabled={editorError !== ""}>
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
