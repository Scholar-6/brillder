import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';
import axios from 'axios';
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

interface AssignPersonOrClassProps {
  brick: Brick;
  history: any;
  isOpen: boolean;
  success(items: any[], failed: any[]): void;
  close(): void;
  requestFailed(e: string): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [isSaving, setSaving] = React.useState(false);
  const [value] = React.useState("");
  const [existingClass, setExistingClass] = React.useState(null as any);
  const [isCreating, setCreating] = React.useState(false);
  const [deadlineDate, setDeadline] = React.useState(null as null | Date);
  const [classes, setClasses] = React.useState<Classroom[]>([]);
  const [haveDeadline, toggleDeadline] = React.useState(false);
  const [newClassName, setNewClassName] = React.useState('');

  //#region New Class
  const [currentEmail, setCurrentEmail] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);

  //eslint-disable-next-line
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const addUser = (email: string) => {
    if (!emailRegex.test(email)) { return; }
    setCurrentEmail('');
    setUsers(users => [ ...users, { email } as User]);
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

  const onAddUser = React.useCallback(() => {
    if (!emailRegex.test(currentEmail)) { return; }
    setCurrentEmail('');
    setUsers(users => [ ...users, { email: currentEmail} as User]);
  }, [currentEmail]);

  const createClassAndAssign = async () => {
    try {
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
            setUsers(users => [ ...users, { email: currentEmail } as User ]);
            currentUsers.push({ email: currentEmail} as User);
            setCurrentEmail("");
          }
          const res = await assignToClassByEmails(newClassroom, currentUsers.map(u => u.email));
          if (res && res.length > 0) {
            if (classes.length == 0) {
              props.history.push(map.ManageClassroomsTab);
            }
            await assignToExistingBrick(newClassroom);
            props.success([newClassroom], []);
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

  const assign = async () => {
    // prevent from double click
    if (isSaving) { return; }
    setSaving(true);

    if (isCreating == false) {
      const res = await assignToExistingBrick(existingClass);
      if (res) {
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
          <input value={newClassName} placeholder="Class Name" onChange={e => setNewClassName(e.target.value)} />
          {renderBrickLevel()}
        </div>
        <div className="r-regular-center">Invite between 1 and 50 students to your class</div>
        <div className="r-student-emails">
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
          onChange={e => setExistingClass(classes.find(c => c.id == e.target.value))}
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
    <div className="dialog-footer centered-important" style={{ justifyContent: 'center' }}>
      <button
        className="btn btn-md bg-theme-orange yes-button icon-button r-long"
        onClick={assign} style={{ width: 'auto' }}
      >
        <div className="centered">
          <span className="label">Assign</span>
        </div>
      </button>
    </div>
  );

  const renderDeadline = () => (
    <div>
      <div className="r-popup-title bold">When is it due?</div>
      <div className="r-radio-buttons">
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
        {haveDeadline && <TimeDropdowns onChange={setDeadline} />}
      </div>
    </div>
  );

  if (classes.length == 0) {
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
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue assign-dialog">
      <div className="dialog-header">
        <div className="r-popup-title bold">Who would you like to assign this brick to?</div>
        <div className="r-radio-row">
          <FormControlLabel
            checked={!isCreating}
            control={<Radio onClick={() => setCreating(false)} className={"filter-radio custom-color"} />}
            label="An Existing Class" />
          <FormControlLabel
            checked={isCreating}
            control={<Radio onClick={() => setCreating(true)} className={"filter-radio custom-color"} />}
            label="Create A New Class" />
        </div>
        {isCreating ? renderNew() : renderExisting()}
        {renderDeadline()}
        {renderFooter()}
      </div>
    </Dialog>
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
