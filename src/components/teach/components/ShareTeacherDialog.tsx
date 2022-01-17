import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import actions from 'redux/actions/requestFailed';
import brickActions from 'redux/actions/brickActions';
import { Editor } from 'model/brick';
import AutocompleteUsername from 'components/play/baseComponents/AutocompleteUsername';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { inviteTeacher } from 'services/axios/classroom';

interface InviteProps {
  isOpen: boolean;
  classId: number;
  close(): void;
  requestFailed(e: string): void;
}

const ShareTeacherDialog: React.FC<InviteProps> = ({ classId, ...props }) => {
  const [teachers, setTeachers] = React.useState<Editor[]>([]);

  const saveEditors = async (editorIds: number[]) => {
    /*
    let res = await props.shareTeachers(brick, editorIds);
    if (res) {
      props.submit(getNameText());
      setEditors([]);
    }
    return res;
    */
  }

  const onNext = async () => {
    if (teachers && teachers.length > 0) {
      let teachersIds = [];
      teachersIds.push(...teachers.map(t => t.id));
      const res = await inviteTeacher(classId, teachersIds);
      console.log(res);
      if (res) {
        setTeachers([]);
        props.close();
      } else {
        props.requestFailed("can`t save editors");
      }
    }
    /*
    if (isValid && editors) {
      const res = await saveEditors(editorsIds);
      if (res) {
        props.close();
      } else {
        props.requestFailed("can`t save editors");
      }
    }*/
  };

  const getNameText = () => {
    return teachers.reduce((prev, current, idx, array) => {
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
        disabled={teachers.length > 0 ? false : true}
        className={`btn bold btn-md yes-button ${teachers.length > 0 ? 'bg-theme-orange' : 'disabled'}`}
        onClick={onNext}
      >
        Share
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
          Who would you like to share this brick with?
        </div>
        <div style={{ marginTop: '1.8vh' }}></div>
        <Grid item className="input-container">
          <div className="audience-inputs border-rounded">
            <AutocompleteUsername
              canEdit={true}
              removeDisabled={true}
              editorError={''}
              placeholder="Teacher's username (first 3 characters)"
              onBlur={() => {}}
              users={teachers}
              setUsers={setTeachers}
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

export default connector(ShareTeacherDialog);
