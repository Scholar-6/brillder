import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Grid, TextField } from "@material-ui/core";
import { Radio } from '@material-ui/core';
import { connect } from "react-redux";

import actions from 'redux/actions/brickActions';
import sprite from "assets/img/icons-sprite.svg";
import { Brick, Editor } from 'model/brick';
import {getUserByUserName} from 'components/services/axios/user';

interface InviteProps {
  canEdit: boolean;
  isOpen: boolean;
  brick: Brick;
  link(): void;
  close(): void;

  assignEditor(brick: Brick): void;
}

const InviteDialog: React.FC<InviteProps> = ({brick, ...props}) => {
  const [accessGranted, setAccess] = React.useState(null as boolean | null);

  const [isValid, setValid] = React.useState(false);
  const [editorUsername, setEditorUsername] = React.useState(brick.editor?.username ?? "");
  const [editor, setEditor] = React.useState(brick.editor);
  const [editorError, setEditorError] = React.useState("");

  const saveEditor = (editorId: number) => {
    props.assignEditor({ ...brick, editor: { id: editorId } as Editor });
    props.close();
  }

  const onNext = () => {
    if (isValid && editor) {
      saveEditor(editor.id);
    }
  };

  const onBlur = async () => {
    if (editorUsername !== "") {
      let data = await getUserByUserName(editorUsername);
      if (data.user) {
        setValid(true);
        setEditor(data.user);
        setEditorError("");
      } else {
        setValid(false);
        setEditorError(data.message);
      }
    } else {
      setValid(false);
      setEditorError("No username input.");
    }
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue unlimited"
    >
      <div className="close-button">
        <svg className="svg active" onClick={props.close}>
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#cancel-thick"} />
        </svg>
      </div>
      <div className="dialog-header">
        <div className="title left">Who would you like to invite to play this brick?</div>
        <div style={{marginTop: '1.8vh'}}></div>
        <Grid item className="input-container">
          <div className="audience-inputs">
            <TextField
              disabled={!props.canEdit}
              value={editorUsername}
              onChange={(evt) => setEditorUsername(evt.target.value)}
              onBlur={(evt) => onBlur()}
              placeholder="Enter editor's username here..."
              error={editorError !== ""}
              helperText={editorError}
              fullWidth
            />
          </div>
        </Grid>
        <div style={{marginTop: '1.8vh'}}></div>
        <div className="title left">Grant editing access?</div>
        <div className="text left">Allow “Name” to comment on the build panels of your brick</div>
        <div className="title left">
          Yes <Radio className="white" checked={accessGranted === true} style={{marginRight: '4vw'}} onClick={() => setAccess(true)} />
          No <Radio className="white" checked={accessGranted === false} onClick={() => setAccess(false)} />
        </div>
      </div>
      <div style={{marginTop: '1.8vh'}}></div>
      <div className="dialog-footer" style={{justifyContent: 'center'}}>
        <button
          className="btn btn-md bg-theme-orange yes-button"
          style={{width: 'auto', paddingLeft: '4vw'}}
          onClick={onNext}
        >
          Send Invite
          <svg className="svg active send-icon" onClick={props.close}>
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#send"} />
          </svg>
        </button>
      </div>
    </Dialog>
  );
}

const mapDispatch = (dispatch: any) => ({
  assignEditor: (brick: any) => dispatch(actions.assignEditor(brick))
});

const connector = connect(null, mapDispatch);

export default connector(InviteDialog);
