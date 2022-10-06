import React, { useState } from 'react';
import { SvgIcon } from '@material-ui/core';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import StudentInviteSuccessDialog from 'components/play/finalStep/dialogs/StudentInviteSuccessDialog';
import { checkAdmin } from 'components/services/brickService';
import { User } from 'model/user';
import { connect } from 'react-redux';
import { ReduxCombinedState } from 'redux/reducers';
import InviteStudentEmailDialog from '../manageClassrooms/components/InviteStudentEmailDialog';

import "./NameAndSubjectForm.scss";
import ShareTeacherDialog from './ShareTeacherDialog';
import { ClassroomStatus } from 'model/classroom';

interface NameAndSubjectFormProps {
  classroom: any;
  onChange(name: string): void;
  user: User;
  onArchive(apiClass: any): void;
  onDelete(apiClass: any): void;
  isArchive?: boolean;  // for assignments
}

const NameAndSubjectFormV2: React.FC<NameAndSubjectFormProps> = props => {
  const { user } = props;
  const [edit, setEdit] = useState(false);
  const [inviteOpen, setInvite] = useState(false);
  const [numStudentsInvited, setInvitedCount] = useState(0);
  const [isShareTeachOpen, setShareTeach] = useState(false);

  const [name, setName] = React.useState<string>();
  const [subjectIndex, setSubjectIndex] = React.useState<number>();

  const startEditing = React.useCallback(() => {
    setEdit(true);

    setName(props.classroom!.name);
    if (props.classroom.subject) {
      setSubjectIndex(user.subjects.findIndex(s => s.id === props.classroom.subject.id));
    }
  }, [props.classroom, user.subjects]);

  const submit = React.useCallback(() => {
    if (name) {
      props.onChange(name);
      setEdit(false);
    }
    /* eslint-disable-next-line */
  }, [name, subjectIndex, props]);

  if (props.isArchive) {
    return (
      <div className="name-subject-display">
        <div className="subject-icon">
          <SpriteIcon
            name={(props.classroom.subject?.color ?? "#FFFFFF") === "#FFFFFF" ? "circle-empty" : "circle-filled"}
            className="w100 h100 active"
            style={{
              color: (props.classroom.subject?.color ?? "#FFFFFF") === "#FFFFFF" ?
                "var(--theme-dark-blue)" :
                props.classroom.subject.color
            }}
          />
        </div>
        <h1 className="name-display">{props.classroom!.name}</h1>
      </div>
    );
  }

  let color = '#4C608A';
  if (props.classroom.subject) {
    color = props.classroom.subject.color;
  }

  return edit ?
    (
      <div className="name-subject-form">
        <div className="subject-input">
          <SvgIcon>
            <SpriteIcon
              name="circle-filled"
              className="w100 h100 active"
              style={{ color }}
            />
          </SvgIcon>
        </div>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="name-input"
        />
        <span className="submit-icon tick" onClick={submit}>
          <SpriteIcon
            name="ok"
            className="w100 h100 active"
          />
        </span>
        <span className="submit-icon" onClick={() => setEdit(false)}>
          <SpriteIcon
            name="cancel-custom"
            className="w100 h100 active"
          />
        </span>
      </div>
    ) : (
      <div className="name-subject-display">
        <div className="name-and-edit-btn">
          <h1 className="name-display">{props.classroom!.name}</h1>
          {(checkAdmin(user.roles) && props.classroom!.teachers) &&
            <span className="class-creator">Created by <span className="creator-name">{props.classroom!.teachers[0].firstName} {props.classroom!.teachers[0].lastName}</span></span>
          }
          <span className="edit-icon" onClick={startEditing}>
            <SpriteIcon
              name="edit-outline"
              className="w100 h100 active"
            />
            <div className="css-custom-tooltip bold">Edit Class Name or Subject</div>
          </span>
        </div>
        <div className="classroom-btns-container">
          <div className="assign-button-container">
            <div className="btn" onClick={() => setInvite(true)}>
              Share class with Students
              <SpriteIcon name="share" />
            </div>
          </div>
          <span className="edit-icon send-teacher" onClick={() => setShareTeach(true)}>
            <SpriteIcon name="send" className="w100 h100 active" />
            <div className="css-custom-tooltip bold">Share with Teachers</div>
          </span>
          {props.classroom.status === ClassroomStatus.Active &&
          <span className="edit-icon archive" onClick={() => {
            props.onArchive(props.classroom)
          }}>
            <SpriteIcon
              name="archive"
              className="w100 h100 active"
            />
            <div className="css-custom-tooltip bold">Archive</div>
          </span>}
          <span className="edit-icon delete-icon" onClick={() => props.onDelete(props.classroom)}>
            <SpriteIcon
              name="delete"
              className="w100 h100 active"
            />
            <div className="css-custom-tooltip bold">Delete Class</div>
          </span>
        </div>
        <InviteStudentEmailDialog
          isOpen={inviteOpen}
          classroom={props.classroom}
          close={(numInvited: number) => {
            setInvite(false);
            setInvitedCount(numInvited);
          }}
        />
        <StudentInviteSuccessDialog
          numStudentsInvited={numStudentsInvited}
          close={() => setInvitedCount(0)}
        />
        <ShareTeacherDialog isOpen={isShareTeachOpen} classId={props.classroom.id} close={() => setShareTeach(false)} />
      </div>
    );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
export default connect(mapState)(NameAndSubjectFormV2);