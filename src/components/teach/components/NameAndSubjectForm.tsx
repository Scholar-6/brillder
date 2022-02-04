import React, { useState } from 'react';
import { ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';

import AssignBrickClass from 'components/baseComponents/dialogs/AssignBrickClass';
import AssignFailedDialog from 'components/baseComponents/dialogs/AssignFailedDialog';
import AssignSuccessDialog from 'components/baseComponents/dialogs/AssignSuccessDialog';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import StudentInviteSuccessDialog from 'components/play/finalStep/dialogs/StudentInviteSuccessDialog';
import { checkAdmin } from 'components/services/brickService';
import { Subject } from 'model/brick';
import { User } from 'model/user';
import { connect } from 'react-redux';
import { ReduxCombinedState } from 'redux/reducers';
import InviteStudentEmailDialog from '../manageClassrooms/components/InviteStudentEmailDialog';

import "./NameAndSubjectForm.scss";
import ShareTeacherDialog from './ShareTeacherDialog';

interface NameAndSubjectFormProps {
  classroom: any;
  onChange(name: string, subject: Subject): void;
  user: User;
  showPremium?(): void;
  onInvited?(): void;
  onAssigned?(): void;
  moveToAssignemts?(): void;
  inviteHidden?: boolean;
  assignHidden?: boolean;
  isArchive?: boolean;  // for assignments
  isStudents?: boolean; // for manage classes page
}

const NameAndSubjectForm: React.FC<NameAndSubjectFormProps> = props => {
  const {user} = props;
  const [edit, setEdit] = useState(false);
  const [isOpen, togglePopup] = useState(false);
  const [successResult, setSuccess] = useState({ isOpen: false, brick: null } as any);
  const [failResult, setFailed] = useState({ isOpen: false, brick: null } as any);
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
    if (name && (subjectIndex !== undefined) && user.subjects[subjectIndex]) {
      props.onChange(name, user.subjects[subjectIndex]);
      setEdit(false);
    }
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

  return edit ?
    (
      <div className="name-subject-form">
        <Select
          value={subjectIndex}
          onChange={e => setSubjectIndex(e.target.value as number)}
          className="subject-input"
          disableUnderline
          IconComponent={
            () => <SvgIcon className="arrow-icon">
              <SpriteIcon
                name="arrow-down"
                className="w100 h100 active"
                style={{
                  color: (user.subjects[subjectIndex!]?.color ?? "#FFFFFF") === "#FFFFFF" ?
                    "var(--theme-dark-blue)" :
                    "var(--white)"
                }}
              />
            </SvgIcon>
          }
        >
          {user.subjects.map((s, i) =>
            <MenuItem value={i} key={i}>
              <ListItemIcon>
                <SvgIcon>
                  <SpriteIcon
                    name={s.color === "#FFFFFF" ? "circle-empty" : "circle-filled"}
                    className="w100 h100 active"
                    style={{ color: s.color === "#FFFFFF" ? "var(--theme-dark-blue)" : s.color }}
                  />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText>{s.name}</ListItemText>
            </MenuItem>
          )}
        </Select>
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
          <div className="subject-icon-hover"
            style={{
              background: (props.classroom.subject?.color ?? "#FFFFFF") === "#FFFFFF" ?
                "var(--theme-dark-blue)" :
                props.classroom.subject.color
            }}
          />
          <SpriteIcon name="share" className="share-icon" onClick={() => setShareTeach(true)} />
          <div className="css-custom-tooltip bold">Share Class</div>
        </div>
        <h1 className="name-display">{props.classroom!.name}</h1>
        <span className="edit-icon" onClick={startEditing}>
          <SpriteIcon
            name="edit-outline"
            className="w100 h100 active"
          />
          <div className="css-custom-tooltip bold">Edit Class Name or Subject</div>
        </span>
        <div className="classroom-btns-container">
          {!props.inviteHidden &&
            <div className="assign-button-container">
              <div className="btn" onClick={() => setInvite(true)}>
                Add a new student
                <SpriteIcon name="user-plus" />
              </div>
            </div>}
          {!props.assignHidden &&
            <div className="assign-button-container">
              <div className="btn" onClick={() => {
                if (user.subscriptionState && user.subscriptionState > 1) {
                  togglePopup(true);
                } else if (user.freeAssignmentsLeft > 0) {
                  togglePopup(true);
                } else if (props.showPremium) {
                  props.showPremium();
                }
              }}>
                Assign a new brick
                <SpriteIcon name="file-plus" />
              </div>
            </div>}
        </div>
        {(checkAdmin(user.roles) && props.classroom!.teachers) && <span className="class-creator">Created by <span className="creator-name">{props.classroom!.teachers[0].firstName} {props.classroom!.teachers[0].lastName}</span></span>}
        {isOpen &&
          <AssignBrickClass
            isOpen={isOpen}
            classroom={props.classroom}
            subjectId={props.classroom.subjectId || props.classroom.subject.id}
            success={brick => {
              setSuccess({ isOpen: true, brick })
              if (props.onAssigned) {
                props.onAssigned();
              }
              if (props.isStudents) {
                props.moveToAssignemts && props.moveToAssignemts();
              }
            }}
            showPremium={() => props.showPremium && props.showPremium()}
            failed={brick => setFailed({ isOpen: true, brick })}
            close={() => togglePopup(false)}
          />}
        <AssignSuccessDialog
          isOpen={successResult.isOpen}
          brickTitle={successResult.brick?.title}
          selectedItems={[props.classroom]}
          close={() => setSuccess({ isOpen: false, brick: null })}
        />
        <AssignFailedDialog
          isOpen={failResult.isOpen}
          brickTitle={failResult.brick?.title}
          selectedItems={[{ classroom: props.classroom }]}
          close={() => setFailed({ isOpen: false, brick: null })}
        />
        <InviteStudentEmailDialog
          isOpen={inviteOpen}
          classroom={props.classroom}
          close={(numInvited: number) => {
            setInvite(false);
            setInvitedCount(numInvited);
            if (props && props.onInvited) {
              props.onInvited();
            }
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
const connector = connect(mapState);

export default connector(NameAndSubjectForm);