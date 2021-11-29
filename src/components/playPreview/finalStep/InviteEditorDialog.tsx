import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import actions from 'redux/actions/requestFailed';
import brickActions from 'redux/actions/brickActions';
import { Brick, Editor } from 'model/brick';
import './InviteEditorDialog.scss';
import AutocompleteUsername from 'components/play/baseComponents/AutocompleteUsername';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface InviteProps {
  canEdit: boolean;
  isOpen: boolean;
  brick: Brick;
  hideAccess?: boolean;
  submit(name: string): void;
  close(): void;
  requestFailed(e: string): void;
  assignEditor(brick: Brick, editorIds: number[]): Promise<boolean>;
}

const InviteEditorDialog: React.FC<InviteProps> = ({ brick, ...props }) => {
  const [isValid, setValid] = React.useState(false);
  let initEditors:any[] = [];
  if (brick.editors) {
    initEditors = brick.editors;
  }
  const [editors, setEditors] = React.useState<Editor[]>(initEditors);
  const [editorError, setEditorError] = React.useState("");

  const saveEditors = async (editorIds: number[]) => {
    let res = await props.assignEditor(brick, editorIds);
    if (res) {
      props.submit(getNameText());
      setEditors([]);
    }
    return res;
  }

  const onNext = async () => {
    if (isValid && editors) {
      let editorsIds = [];
      editorsIds.push(...editors.map(editor => editor.id));
      if (brick.editors) {
        editorsIds.push(...brick.editors.map(editor => editor.id));
      }
      const res = await saveEditors(editorsIds);
      if (res) {
        props.close();
      } else {
        props.requestFailed("can`t save editors");
      }
    }
  };

  const onBlur = React.useCallback(async () => {
    if (editors.length > 0) {
      setValid(true);
      setEditorError("");
    } else {
      setValid(false);
      setEditorError("No editors have been assigned to this brick yet.");
    }
  }, [editors]);

  useEffect(() => {
    onBlur();
  }, [brick, onBlur]);

  const getNameText = () => {
    return editors.reduce((prev, current, idx, array) => {
      if (idx === 0) {
        return `${prev}${current.username}`;
      } else if(idx === array.length - 1) {
        return `${prev} and ${current.username}`;
      } else {
        return `${prev}, ${current.username}`;
      }
    }, "")
  }

  const renderSendButton = () => {
    return (
      <button
        disabled={editors.length > 0 ? false : true}
        className={`btn bold btn-md yes-button ${editors.length > 0 ? 'bg-theme-orange' : 'disabled'}`}
        onClick={onNext}
      >
        Invite new editor{editors.length > 1 ? 's' : ''}
        <SpriteIcon name="send" className="active send-icon" onClick={props.close} />
      </button>
    );
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue unlimited invite-editor-dialog"
    >
      <div className="close-button svgOnHover" onClick={props.close}>
        <SpriteIcon name="cancel-thick" className="active" />
      </div>
      <div className="dialog-header" style={{ minWidth: '30vw' }}>
        <div className="title">
          Who would you like to edit this brick?
        </div>
        <div style={{ marginTop: '1.8vh' }}></div>
        <Grid item className="input-container">
          <div className="audience-inputs border-rounded">
            <AutocompleteUsername
              canEdit={props.canEdit}
              brick={brick}
              removeDisabled={true}
              editorError={editorError}
              placeholder="Editor's username (first 3 characters)"
              onBlur={onBlur}
              users={editors}
              setUsers={setEditors}
            />
          </div>
        </Grid>
      </div>
      <div className="dialog-footer" style={{ justifyContent: 'center' }}>
        {renderSendButton()}
      </div>
    </Dialog>
  );
}

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
  assignEditor: (brick: any, editor: any) => dispatch(brickActions.assignEditor(brick, editor))
});

const connector = connect(null, mapDispatch);

export default connector(InviteEditorDialog);
