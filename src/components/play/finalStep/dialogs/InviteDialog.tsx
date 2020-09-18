import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Grid, TextField } from "@material-ui/core";
import { Radio } from '@material-ui/core';
import { connect } from "react-redux";

import actions from 'redux/actions/brickActions';
import sprite from "assets/img/icons-sprite.svg";
import { Brick, Editor } from 'model/brick';
import {getUserByUserName} from 'components/services/axios/user';
import {inviteUser} from 'components/services/axios/brick';

interface InviteProps {
  canEdit: boolean;
  isOpen: boolean;
  brick: Brick;
  submit(name: string, accessGranted: boolean): void;
  close(): void;

  assignEditor(brick: Brick): void;
}

const InviteDialog: React.FC<InviteProps> = ({brick, ...props}) => {
  const [accessGranted, setAccess] = React.useState(null as boolean | null);

  const [isValid, setValid] = React.useState(false);
  const [editorUsername, setEditorUsername] = React.useState(brick.editor?.username ?? "");
  const [editor, setEditor] = React.useState(brick.editor);
  const [editorError, setEditorError] = React.useState("");

  const saveEditor = (editorId: number, fullName: string) => {
    props.assignEditor({ ...brick, editor: { id: editorId } as Editor });
    props.submit(fullName, accessGranted || false);
  }

  const inviteUserById = async (userId: number, fullName: string) => {
    let success = await inviteUser(brick.id, userId);
    if (success) {
      props.submit(fullName, accessGranted || false);
    } else {
      // failed
    }
    props.close();
  }

  const onNext = () => {
    if (isValid && editor) {
      if (accessGranted) {
        saveEditor(editor.id, editor.firstName);
        props.close();
      } else {
        inviteUserById(editor.id, editor.firstName);
      }
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

  useEffect(() => {
    onBlur();
  }, [brick]);

  const renderCustomText = () => {
    let name = 'Name';
    if (editor) {
      name = editor.firstName;
    }
    return `Allow ${name} to comment on the build panels of your brick`;
  }

  const renderSendButton = () => {
    return (
      <button
        className="btn bold btn-md bg-theme-orange yes-button"
        style={{width: 'auto', paddingLeft: '4vw'}}
        onClick={onNext}
      >
        Send Invite
        <svg className="svg active send-icon" onClick={props.close}>
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#send"} />
        </svg>
      </button>
    );
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue unlimited"
    >
      <div className="close-button" style={{width: '1.5vw', height: '1.5vw'}}>
        <svg className="svg active" onClick={props.close}>
          {/*eslint-disable-next-line*/}
          <use href={sprite + "#cancel-thick"} />
        </svg>
      </div>
      <div className="dialog-header" style={{minWidth: '30vw'}}>
        <div className="title left">Who would you like to invite to play this brick?</div>
        <div style={{marginTop: '1.8vh'}}></div>
        <Grid item className="input-container">
          <div className="audience-inputs border-rounded">
            <TextField
              disabled={!props.canEdit}
              value={editorUsername}
              style={{background: 'inherit'}}
              onChange={(evt) => setEditorUsername(evt.target.value)}
              onBlur={() => onBlur()}
              placeholder="Enter editor's username here..."
              error={editorError !== ""}
              helperText={editorError}
              fullWidth
            />
          </div>
        </Grid>
        <div style={{marginTop: '1.8vh'}}></div>
        <div className="title left">Grant editing access?</div>
        <div className="text left" style={{marginBottom: '1.8vh'}}>{renderCustomText()}</div>
        <div className="title left">
          Yes <Radio className="white" checked={accessGranted === true} style={{marginRight: '4vw'}} onClick={() => setAccess(true)} />
          No <Radio className="white" checked={accessGranted === false} onClick={() => setAccess(false)} />
        </div>
      </div>
      <div style={{marginTop: '1.8vh'}}></div>
      <div className="dialog-footer" style={{justifyContent: 'center'}}>
        {renderSendButton()}
      </div>
    </Dialog>
  );
}

const mapDispatch = (dispatch: any) => ({
  assignEditor: (brick: any) => dispatch(actions.assignEditor(brick))
});

const connector = connect(null, mapDispatch);

export default connector(InviteDialog);
