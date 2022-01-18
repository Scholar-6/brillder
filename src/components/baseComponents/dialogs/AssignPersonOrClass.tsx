import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';
import { connect } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './AssignPersonOrClass.scss';
import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/requestFailed';
import { User } from 'model/user';
import { Classroom } from 'model/classroom';
import { AcademicLevelLabels, Brick, Subject } from 'model/brick';
import { assignToClassByEmails, getClassrooms } from 'services/axios/classroom';
import SpriteIcon from '../SpriteIcon';
import TimeDropdowns from '../timeDropdowns/TimeDropdowns';
import { AssignClassData, assignClasses } from 'services/axios/assignBrick';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';
import { createClass } from 'components/teach/service';
import map from 'components/map';
import InvalidDialog from 'components/build/baseComponents/dialogs/InvalidDialog';
import ValidationFailedDialog from './ValidationFailedDialog';

interface AssignPersonOrClassProps {
  brick: Brick;
  user?: User;
  history: any;
  isOpen: boolean;
  success(items: any[], failed: any[]): void;
  close(): void;
  requestFailed(e: string): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [alreadyAssigned, setAssigned] = React.useState(false);
  const [isSaving, setSaving] = React.useState(false);
  const [value] = React.useState("");
  const [existingClass, setExistingClass] = React.useState(null as any);
  const [isCreating, setCreating] = React.useState(false);
  const [deadlineDate, setDeadline] = React.useState(new Date());
  const [classes, setClasses] = React.useState<Classroom[]>([]);
  const [haveDeadline, toggleDeadline] = React.useState(false);
  const [newClassName, setNewClassName] = React.useState('');

  // validation
  const [validationRequired, setValidation] = React.useState(false);
  const [isInvalidOpen, showInvalid] = React.useState(false);

  //#region New Class
  const [currentEmail, setCurrentEmail] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);

  //eslint-disable-next-line
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const addUser = (email: string) => {
    if (!emailRegex.test(email)) { return; }
    setCurrentEmail('');
    setUsers(users => [...users, { email } as User]);
  }

  const checkSpaces = (email: string) => {
    const emails = email.split(' ');
    if (emails.length >= 2) {
      for (let email of emails) {
        addUser(email);
      }
    } else {
      setCurrentEmail(email.trim());
    }
  }

  const validate = () => (!newClassName || users.length === 0) ? false : true;

  const onAddUser = React.useCallback(() => {
    if (!emailRegex.test(currentEmail)) { return; }
    setCurrentEmail('');
    setUsers(users => [...users, { email: currentEmail } as User]);
    //eslint-disable-next-line
  }, [currentEmail]);

  const createClassAndAssign = async () => {
    try {
      // validation
      const isValid = validate();
      if (isValid === false) {
        setValidation(true);
        showInvalid(true);
        return;
      }

      const subject = props.brick.subject as Subject;
      if (newClassName) {
        const newClassroom = await createClass(newClassName, subject);
        if (newClassroom) {
          // assign students to class
          const currentUsers = users;
          if (!emailRegex.test(currentEmail)) {
            if (users.length <= 0) {
              return;
            }
          } else {
            setUsers(users => [...users, { email: currentEmail } as User]);
            currentUsers.push({ email: currentEmail } as User);
            setCurrentEmail("");
          }
          const res = await assignToClassByEmails(newClassroom, currentUsers.map(u => u.email));
          if (res && res.length > 0) {
            await assignToExistingBrick(newClassroom);

            if (props.user && props.user.freeAssignmentsLeft) {
              props.user.freeAssignmentsLeft = props.user.freeAssignmentsLeft - 1;
            }
            props.success([newClassroom], []);

            // only for new classes
            if (classes.length === 0) {
              props.history.push(`${map.TeachAssignedTab}?classroomId=${newClassroom.id}&${map.NewTeachQuery}&assignmentExpanded=true`);
            }
          }
          await getClasses();
        } else {
          console.log('failed to create class');
        }
      } else {
        console.log('class name is empty');
      }
    } catch {
      console.log('failed create class and assign students');
    }
    // clear data
    setUsers([]);
    setNewClassName('');
  }
  //#endregion

  const getClasses = React.useCallback(async () => {
    let classrooms = await getClassrooms();
    if (!classrooms) { classrooms = []; }

    classrooms = classrooms.filter(c => c.subjectId > 0);

    for (const classroom of classrooms) {
      classroom.isClass = true;
    }

    if (classrooms.length > 0) {
      setExistingClass(classrooms[0]);
    } else {
      setCreating(true);
    }

    setClasses(classrooms);
  }, []);

  useEffect(() => {
    getClasses();
  }, [value, getClasses]);

  const assignToExistingBrick = async (classroom: any) => {
    let data = { classesIds: [classroom.id], deadline: null } as AssignClassData;
    if (haveDeadline && deadlineDate) {
      data.deadline = deadlineDate;
    }
    return await assignClasses(props.brick.id, data);
  }

  /**
   * Assign brick to class
   * @returns 
   */
  const assign = async () => {
    // prevent from double click
    if (isSaving) { return; }
    setSaving(true);

    if (isCreating === false) {
      const res = await assignToExistingBrick(existingClass);

      if (res && res.length > 0) {
        let allArchived = true;
        for (let a of res) {
          if (a.isArchived !== true) {
            allArchived = false;
          }
        }
        if (allArchived) {
          if (props.user && props.user.freeAssignmentsLeft) {
            props.user.freeAssignmentsLeft = props.user.freeAssignmentsLeft - 1;
          }

          props.success([existingClass], []);
        } else {
          setAssigned(true);
        }
      } else if (res !== false) {
        if (props.user && props.user.freeAssignmentsLeft) {
          props.user.freeAssignmentsLeft = props.user.freeAssignmentsLeft - 1;
        }

        props.success([existingClass], []);
      }
    } else {
      await createClassAndAssign();
    }
    setSaving(false);
  }

  const renderBrickLevel = () => (
    <div className="r-brick-level">
      Level {AcademicLevelLabels[props.brick.academicLevel]}
    </div>
  );

  const renderNew = () => {
    return (
      <div className="r-new-class">
        <div className="r-class-inputs">
          <input value={newClassName} className={(validationRequired && !newClassName) ? 'invalid' : ''} placeholder="Class Name" onChange={e => setNewClassName(e.target.value)} />
          {renderBrickLevel()}
        </div>
        <div className="r-regular-center">Invite between 1 and 50 students to your class</div>
        <div className={`r-student-emails ${(validationRequired && users.length === 0) ? 'invalid' : ''}`}>
          <AutocompleteUsernameButEmail
            placeholder="Type or paste student emails"
            currentEmail={currentEmail}
            users={users}
            onAddEmail={onAddUser}
            onChange={email => checkSpaces(email.trim())}
            setUsers={users => {
              setCurrentEmail('');
              setUsers(users as User[]);
            }}
          />
        </div>
        <InvalidDialog isOpen={isInvalidOpen} label="Please fill in the fields in red" close={() => showInvalid(false)} />
      </div>
    )
  }

  const renderExisting = () => {
    if (classes.length <= 0) { return <div />; }
    return (
      <div className="r-class-selection">
        <Select
          className="select-existed-class"
          MenuProps={{ classes: { paper: 'select-classes-list' } }}
          value={existingClass.id}
          onChange={e => setExistingClass(classes.find(c => c.id === parseInt(e.target.value as string)))}
        >
          {classes.map((c: any, i) =>
            <MenuItem value={c.id} key={i}>
              <ListItemIcon>
                <SvgIcon>
                  <SpriteIcon
                    name="circle-filled"
                    className="w100 h100 active"
                    style={{ color: c.subject.color }}
                  />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText>{c.name}</ListItemText>
            </MenuItem>
          )}
        </Select>
        {renderBrickLevel()}
      </div>
    );
  }

  const renderFooter = () => (
    <div className="action-row custom-action-row" style={{ justifyContent: 'center' }}>
      <div className="left-label">

        {props.user?.freeAssignmentsLeft || 0} free Assignments Left
      </div>
      <button
        className="btn btn-md bg-theme-orange yes-button icon-button r-long"
        onClick={assign} style={{ width: 'auto' }}
      >
        <div className="centered">
          <span className="label">Assign</span>
          <SpriteIcon name="file-plus" />
        </div>
      </button>
      <div className="premium-btn flex-center" onClick={() => props.history.push(map.ChoosePlan)}>
        Go Premium <SpriteIcon name="hero-sparkle" />
      </div>
    </div>
  );

  const renderDeadline = () => (
    <div className="r-radio-buttons">
      <div className="label">
        When is it due?
      </div>
      <FormControlLabel
        checked={haveDeadline === false}
        control={<Radio onClick={() => toggleDeadline(false)} />}
        label="No deadline"
      />
      <FormControlLabel
        checked={haveDeadline === true}
        control={<Radio onClick={() => toggleDeadline(true)} />}
        label="Set date"
      />
      {haveDeadline && <TimeDropdowns date={deadlineDate} onChange={setDeadline} />}
    </div>
  );

  if (classes.length === 0) {
    return (
      <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue assign-dialog">
        <div className="dialog-header">
          <div className="r-popup-title bold r-first-class">Create Your First Class</div>
          {renderNew()}
          {renderDeadline()}
          {renderFooter()}
        </div>
      </Dialog>
    );
  }

  return (
    <div>
      <Dialog open={props.isOpen} onClose={props.close} className="dialog-box assign-student-popup light-blue assign-dialog">
        <div className="dialog-header">
          <div className="r-popup-title bold">Who would you like to assign this brick to?</div>
          {isCreating ? renderNew() : renderExisting()}
          {!isCreating &&
            <div className="switch-mode" onClick={() => setCreating(true)}>
              <SpriteIcon name="plus-circle" />
              Create a new Class
            </div>
          }
        </div>
        <div className="dialog-footer-white">
          {renderDeadline()}
          {renderFooter()}
        </div>
      </Dialog>
      <ValidationFailedDialog isOpen={alreadyAssigned} close={() => setAssigned(false)} header="This brick has already been assigned to this class." />
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  brick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

const connector = connect(mapState, mapDispatch);

export default connector(AssignPersonOrClassDialog);
