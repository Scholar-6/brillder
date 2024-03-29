import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Grid } from "@material-ui/core";
import { Radio } from '@material-ui/core';
import { connect } from "react-redux";

import actions from 'redux/actions/brickActions';
import { Brick } from 'model/brick';
import { inviteUser, shareByEmails } from 'services/axios/brick';
import AutocompleteUsernameAndEmail, { ShareUser } from 'components/play/baseComponents/AutocompleteUsernameAndEmail';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import PrivateConfirmDialog from 'components/baseComponents/dialogs/PrivateConfirmDialog';

interface InviteProps {
  canEdit: boolean;
  isOpen: boolean;
  brick: Brick;
  hideAccess?: boolean;
  isAuthor: boolean;
  title?: string;
  accessGranted?: boolean;
  submit(name: string, accessGranted: boolean): void;
  close(): void;

  assignEditor(brick: Brick, editors: number[]): void;
}

const InviteDialog: React.FC<InviteProps> = ({ brick, ...props }) => {
  const initAccess = (props.accessGranted === true || props.accessGranted === false) ? props.accessGranted : null;
  const [accessGranted, setAccess] = React.useState(initAccess);
  const [confirmPrivate, setConfirmPrivate] = React.useState(false);

  const [isValid, setValid] = React.useState(false);
  const [editors, setEditors] = React.useState<ShareUser[]>([]);
  const [editorError, setEditorError] = React.useState("");

  React.useEffect(() => {
    if (accessGranted) {
      setEditors(brick.editors ?? []);
    } else {
      setEditors([]);
    }
    /*eslint-disable-next-line*/
  }, [accessGranted])

  const saveEditor = (editorIds: number[]) => {
    props.assignEditor(brick, editorIds);
    props.submit(getNameText(), accessGranted || false);
  }

  const inviteUserById = async (userId: number) => {
    let success = await inviteUser(brick.id, userId);
    if (success) {
      props.submit(getNameText(), accessGranted || false);
    } else {
      // failed
    }
    props.close();
  }

  const onNext = async () => {
    if (isValid && editors) {
      if (accessGranted) {
        saveEditor(editors.map(editor => editor.id));
        props.close();
      } else {
        if (brick.isCore) {
          editors.forEach(editor => {
            if (editor.id) {
              inviteUserById(editor.id);
            }
          });
          const shareUserEmails = editors.filter(e => e.isJustEmail);
          const shareEmails = shareUserEmails.map(u => u.email);
          await shareByEmails(brick.id, shareEmails);
          setEditors([]);
        } else {
          setConfirmPrivate(true);
        }
      }
    }
  };

  const onBlur = React.useCallback(async () => {
    if (editors.length > 0) {
      setValid(true);
      setEditorError("");
    } else {
      setValid(false);
      setEditorError("Nobody invited yet.");
    }
  }, [editors]);

  useEffect(() => {
    onBlur();
  }, [brick, onBlur]);

  const getNameText = () => {
    return editors.reduce((prev, current, idx, array) => {
      if (idx === 0) {
        return `${prev}${current.username}`;
      } else if (idx === array.length - 1) {
        return `${prev}, ${current.username}`;
      } else {
        return `${prev}, and ${current.username}`;
      }
    }, "")
  }

  const renderCustomText = () => {
    let name = getNameText();
    if (!name) {
      name = 'Name';
    }
    return `Allow ${name} to comment on the build panels of your brick`;
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue unlimited"
    >
      <div className="close-button svgOnHover" onClick={props.close}>
        <SpriteIcon name="cancel-thick" className="active" />
      </div>
      <div className="dialog-header" style={{ minWidth: '30vw' }}>
        <div className="title left">
          {props.title ? props.title : 'Who would you like to invite to play this brick?'}
        </div>
        <div style={{ marginTop: '1.8vh' }}></div>
        <Grid item className="input-container">
          <div className="audience-inputs border-rounded">
            <AutocompleteUsernameAndEmail
              canEdit={props.canEdit}
              brick={brick}
              editorError={editorError}
              placeholder={`Email or ${accessGranted ? "editor's " : ""}username`}
              onBlur={onBlur}
              users={editors}
              setUsers={setEditors}
            />
          </div>
        </Grid>
        {props.isAuthor && !props.hideAccess ?
          <div>
            <div style={{ marginTop: '1.8vh' }}></div>
            <div className="title left">Grant editing access?</div>
            <div className="text left" style={{ marginBottom: '1.8vh' }}>{renderCustomText()}</div>
            <div className="title left">
              Yes <Radio className="white" checked={accessGranted === true} style={{ marginRight: '4vw' }} onClick={() => setAccess(true)} />
              No <Radio className="white" checked={accessGranted === false} onClick={() => setAccess(false)} />
            </div>
          </div> : ""}
      </div>
      <div className="dialog-footer" style={{ justifyContent: 'center' }}>
        <button
          className="btn bold btn-md bg-theme-orange yes-button"
          style={{ width: 'auto', paddingLeft: '4vw' }}
          onClick={onNext}
        >
          Send Invite
          <SpriteIcon name="send" className="active send-icon" onClick={props.close} />
        </button>
      </div>
      <PrivateConfirmDialog
        isOpen={confirmPrivate}
        close={() => {
          setConfirmPrivate(false);
          setEditors([]);
          props.close();
        }}
        submit={() => {
          setConfirmPrivate(false);
          editors.forEach(editor => inviteUserById(editor.id));
          setEditors([]);
          props.close();
        }}
      />
    </Dialog>
  );
}


const mapDispatch = (dispatch: any) => ({
  assignEditor: (brick: any, editors: number[]) => dispatch(actions.assignEditor(brick, editors))
});

const connector = connect(null, mapDispatch);

export default connector(InviteDialog);
