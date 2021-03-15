import { ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';
import AssignBrickClass from 'components/baseComponents/dialogs/AssignBrickClass';
import AssignFailedDialog from 'components/baseComponents/dialogs/AssignFailedDialog';
import AssignSuccessDialog from 'components/baseComponents/dialogs/AssignSuccessDialog';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import StudentInviteSuccessDialog from 'components/play/finalStep/dialogs/StudentInviteSuccessDialog';
import { Subject } from 'model/brick';
import { User } from 'model/user';
import React from 'react';
import { connect } from 'react-redux';
import { ReduxCombinedState } from 'redux/reducers';
import InviteStudentEmailDialog from '../manageClassrooms/components/InviteStudentEmailDialog';

import "./NameAndSubjectForm.scss";

interface NameAndSubjectFormProps {
  buttonsInvisible?: boolean;
  classroom: any;
  onChange(name: string, subject: Subject): void;
  user: User;
  onInvited?(): void;
}

const NameAndSubjectForm: React.FC<NameAndSubjectFormProps> = props => {
  const [edit, setEdit] = React.useState(false);
  const [isOpen, togglePopup] = React.useState(false);
  const [successResult, setSuccess] = React.useState({ isOpen: false, brick: null } as any);
  const [failResult, setFailed] = React.useState({ isOpen: false, brick: null } as any);
  const [inviteOpen, setInvite] = React.useState(false);
  const [numStudentsInvited, setInvitedCount] = React.useState(0);

  const [name, setName] = React.useState<string>();
  const [subjectIndex, setSubjectIndex] = React.useState<number>();

  const startEditing = React.useCallback(() => {
    setEdit(true);

    setName(props.classroom!.name);
    if (props.classroom.subject) {
      setSubjectIndex(props.user.subjects.findIndex(s => s.id === props.classroom.subject.id));
    }
  }, [props.classroom, props.user.subjects]);

  const submit = React.useCallback(() => {
    if (name && (subjectIndex !== undefined) && props.user.subjects[subjectIndex]) {
      props.onChange(name, props.user.subjects[subjectIndex]);
      setEdit(false);
    }
  }, [name, subjectIndex, props]);

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
                  color: (props.user.subjects[subjectIndex!]?.color ?? "#FFFFFF") === "#FFFFFF" ?
                    "var(--theme-dark-blue)" :
                    "var(--white)"
                }}
              />
            </SvgIcon>
          }
        >
          {props.user.subjects.map((s, i) =>
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
        </div>
        <h1 className="name-display">{props.classroom!.name}</h1>
        <span className="edit-icon" onClick={startEditing}>
          <SpriteIcon
            name="edit-outline"
            className="w100 h100 active"
          />
          <div className="css-custom-tooltip">Edit Class Name or Subject</div>
        </span>
        <div className="classroom-btns-container">
          <div className="assign-button-container">
            <div className="btn icon-button" onClick={() => setInvite(true)}>
              <SpriteIcon name="user-plus" />
              <div className="css-custom-tooltip">Add New Student</div>
            </div>
          </div>
          {!props.buttonsInvisible &&
            <div className="assign-button-container">
              <div className="btn" onClick={() => togglePopup(true)}>
                Assign a new brick
              <SpriteIcon name="file-plus" />
              </div>
            </div>}
        </div>
        <AssignBrickClass
          isOpen={isOpen}
          classroomId={props.classroom.id}
          subjectId={props.classroom.subjectId || props.classroom.subject.id}
          success={brick => setSuccess({ isOpen: true, brick })}
          failed={brick => setFailed({ isOpen: true, brick })}
          close={() => togglePopup(false)}
        />
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
      </div>
    );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(NameAndSubjectForm);