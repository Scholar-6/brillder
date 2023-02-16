import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';
import { connect } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import queryString from 'query-string';

import './AssignPersonOrClass.scss';
import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/requestFailed';
import { User } from 'model/user';
import { Classroom } from 'model/classroom';
import { Brick } from 'model/brick';
import { assignToClassByEmails, getClassrooms } from 'services/axios/classroom';
import SpriteIcon from '../SpriteIcon';
import TimeDropdowns from '../timeDropdowns/TimeDropdowns';
import { AssignClassData, assignClasses } from 'services/axios/assignBrick';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';
import { createClass } from 'components/teach/service';
import map from 'components/map';
import ValidationFailedDialog from './ValidationFailedDialog';
import HoverHelp from '../hoverHelp/HoverHelp';
import PremiumEducatorDialog from 'components/play/baseComponents/dialogs/PremiumEducatorDialog';

interface AssignPersonOrClassProps {
  brick: Brick;
  user?: User;
  history: any;
  isOpen: boolean;
  success(items: any[], failed: any[]): void;
  showPremium?(): void;
  close(): void;
  requestFailed(e: string): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [helpTextExpanded, setHelpText] = React.useState(false);
  const [alreadyAssigned, setAssigned] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [isSaving, setSaving] = React.useState(false);
  const [value] = React.useState("");
  const [existingClass, setExistingClass] = React.useState(null as any);
  const [isCreating, setCreating] = React.useState(false);
  const [deadlineDate, setDeadline] = React.useState(new Date());
  const [classes, setClasses] = React.useState<Classroom[]>([]);
  const [haveDeadline, toggleDeadline] = React.useState(false);
  const [newClassName, setNewClassName] = React.useState('');
  const [isNewTeacher, setNewTeacher] = React.useState(false);

  const [isPremiumDialogOpen, setPremium] = React.useState(false);

  const [canSubmit, setSubmit] = React.useState(true);

  //#region New Class
  const [currentEmail, setCurrentEmail] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);

  //eslint-disable-next-line
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const addUser = (email: string) => {
    if (!emailRegex.test(email)) { return; }
    setCurrentEmail('');
    setUsers(users => [...users, { email } as User]);
    setSubmit(true);
  }

  const success = (items: any[], failed: any[]) => {
    props.success(items, failed);
    if (isNewTeacher) {
      props.history.push(map.TeachAssignedTab);
    }
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

  const validate = () => (!newClassName || canSubmit === false) ? false : true;

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
        return;
      }

      if (newClassName) {
        const newClassroom = await createClass(newClassName);
        if (newClassroom) {
          // assign students to class
          const currentUsers = users;
          if (!emailRegex.test(currentEmail)) {
          } else {
            setUsers(users => [...users, { email: currentEmail } as User]);
            currentUsers.push({ email: currentEmail } as User);
            setCurrentEmail("");
          }

          const res = await assignToClassByEmails(newClassroom, currentUsers.map(u => u.email));
          if (res) {
            await assignToExistingBrick(newClassroom);

            if (props.user && props.user.freeAssignmentsLeft) {
              props.user.freeAssignmentsLeft = props.user.freeAssignmentsLeft - 1;
            }
            success([newClassroom], []);
            props.history.push(`${map.TeachAssignedTab}?classroomId=${newClassroom.id}&${map.NewTeachQuery}&assignmentExpanded=true`);
          }
          await getClasses();
          props.close();
        } else {
          console.log('failed to create class');
        }
      } else {
        console.log('class name is empty');
      }
    } catch {
      console.log('failed create class and assign learners');
    }
    // clear data
    setUsers([]);
    setNewClassName('');
  }
  //#endregion

  const getClasses = React.useCallback(async () => {
    let classrooms = await getClassrooms();
    if (!classrooms) { classrooms = []; }

    for (const classroom of classrooms) {
      classroom.isClass = true;
    }
    classrooms.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    if (classrooms.length > 0) {
      setExistingClass(classrooms[0]);
    } else {
      setCreating(true);
    }

    setClasses(classrooms);
    setLoading(false);
  }, []);

  useEffect(() => {
    getClasses();
  }, [value, getClasses]);

  useEffect(() => {
    const values = queryString.parse(props.history.location.search);
    if (values.newTeacher) {
      setNewTeacher(true);
    }
    /*eslint-disable-next-line*/
  }, []);

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

    if (isCreating && (canSubmit === false || newClassName === '')) {
      return;
    }

    if (isCreating === false) {
      const res = await assignToExistingBrick(existingClass);

      if (res.success && res.result.length > 0) {
        let allArchived = true;
        for (let a of res.result) {
          if (a.isArchived !== true) {
            allArchived = false;
          }
        }
        if (allArchived) {
          if (props.user && props.user.freeAssignmentsLeft) {
            props.user.freeAssignmentsLeft = props.user.freeAssignmentsLeft - 1;
          }
          success([existingClass], []);
        } else {
          setAssigned(true);
        }
      } else if (res.success !== false) {
        if (props.user && props.user.freeAssignmentsLeft) {
          props.user.freeAssignmentsLeft = props.user.freeAssignmentsLeft - 1;
        }

        success([existingClass], []);
        props.close();
      } else {
        if (res.error === 'Subscription is not valid.') {
          console.log('show premium popup')
          props.close();
          setPremium(true);
        }
      }
    } else {
      await createClassAndAssign();
    }
    setSaving(false);
  }

  const renderNew = () => {
    return (
      <div className="r-new-class">
        <div className="r-class-inputs">
          <input value={newClassName} placeholder="Class Name" onChange={e => setNewClassName(e.target.value)} />
        </div>
        <div className="r-regular-center help-text-r423 flex-center">
          <div>
            Invite your students below. Or, leave blank to add the brick and invite students later
          </div>
          <div className="absolute-difficult-help">
            <HoverHelp>
              <div>
                <div>You can add students later by</div>
                <div>visiting the Manage Classes page.</div>
              </div>
            </HoverHelp>
          </div>
        </div>
        <div className="r-student-emails">
          <AutocompleteUsernameButEmail
            placeholder="Type or paste up to 50 learner emails, then press Enter ⏎"
            currentEmail={currentEmail}
            users={users}
            onAddEmail={onAddUser}
            onChange={email => checkSpaces(email.trim())}
            setUsers={users => {
              setCurrentEmail('');
              setUsers(users as User[]);
            }}
            isEmpty={canSubmit}
            setEmpty={setSubmit}
          />
        </div>
        {renderDeadline()}
      </div>
    )
  }

  const renderExisting = () => {
    if (classes.length <= 0) { return <div />; }
    return (
      <div className="existing">
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
                      style={{ color: c.subject?.color || '#4C608A' }}
                    />
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText>{c.name}</ListItemText>
              </MenuItem>
            )}
          </Select>
        </div>
        {renderDeadline()}
      </div>
    );
  }

  const renderFooter = () => (
    <div className="action-row custom-action-row" style={{ justifyContent: 'center' }}>
      <button
        className={`btn btn-md bg-theme-orange yes-button icon-button r-long ${(isCreating && (newClassName === '' || !canSubmit)) ? 'invalid' : ''}`}
        onClick={assign} style={{ width: 'auto' }}
      >
        <div className="centered">
          <span className="label">Assign</span>
          <SpriteIcon name="file-plus" />
        </div>
      </button>
    </div>
  );

  const renderDeadline = () => (
    <div className="deadline-v2">
      <div className="label">
        When is it due?
      </div>
      <div className="r-radio-buttons">
        <div>
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
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue assign-student-popup assign-dialog create-first-class">
        <div className="dialog-header">
          <div className="r-popup-title bold">Which class would you like to assign this brick to?</div>
          <div className="flex-center">
            <SpriteIcon name="f-loader" className="spinning" />
          </div>
        </div>
      </Dialog>
    );
  }

  if (classes.length === 0) {
    return (
      <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue assign-student-popup assign-dialog create-first-class">
        <div className="dialog-header">
          <div className="r-popup-title bold r-first-class">Create Your First Class</div>
          {renderNew()}
        </div>
        <div className="dialog-footer-white">
          <div className="help-footer-text">
            {(isCreating && !canSubmit)
              ? 'Please ensure that you have entered all email addresses correctly and pressed enter.'
              : <div className="help-expandable">
                <div className="help-icon-v3">
                  <SpriteIcon name="help-icon-v3" />
                </div>
                <div className="help-text">
                  <div>Students might not receive invites if your institution</div>
                  <div className="text-with-icon">
                    filters emails. <span className="underline bold" onClick={() => {
                      setHelpText(!helpTextExpanded);
                    }}>How to avoid this</span>
                    <SpriteIcon name="arrow-down" className={helpTextExpanded ? 'expanded' : ''} onClick={() => {
                      setHelpText(!helpTextExpanded);
                    }} />
                  </div>
                </div>
              </div>
            }</div>
          {renderFooter()}
        </div>
        {canSubmit && helpTextExpanded && users.length > 0 &&
          <div className="expanded-text-v3">
            <div className="spacing-bigger">
              To ensure invites are received, please ask your network administrator to whitelist <a href="mailto: notifications@brillder.com" className="text-underline">notifications@brillder.com</a>. They may want the following information:
            </div>
            <div className="light">
              Brillder is the trading name of Scholar 6 Ltd, which is on the UK Register of Learning
            </div>
            <div className="text-center light">
              Providers (UK Provider Reference Number 10090571)
            </div>
          </div>}
      </Dialog>
    );
  }

  return (
    <div>
      <Dialog open={props.isOpen} onClose={props.close} className="dialog-box assign-student-popup light-blue assign-dialog">
        <div className="dialog-header">
          <div className="r-popup-title bold">Which class would you like to assign this brick to?</div>
          <div className="psevdo-radio-class">
            <div className="switch-mode" onClick={() => setCreating(false)}>
              <Radio checked={!isCreating} />
              An existing class
            </div>
            <div className="switch-mode" onClick={() => setCreating(true)}>
              <Radio checked={isCreating} />
              Create a new class
            </div>
          </div>
          {isCreating ? renderNew() : renderExisting()}
        </div>
        <div className="dialog-footer-white">
          <div className="help-footer-text">
            {(isCreating && !canSubmit)
              ? 'Please ensure that you have entered all email addresses correctly and pressed enter.'
              : (users.length > 0) && <div className="help-expandable">
                <div className="help-icon-v3">
                  <SpriteIcon name="help-icon-v3" />
                </div>
                <div className="help-text">
                  <div>Students might not receive invites if your institution</div>
                  <div className="text-with-icon">
                    filters emails. <span className="underline bold" onClick={() => {
                      setHelpText(!helpTextExpanded);
                    }}>How to avoid this</span>
                    <SpriteIcon name="arrow-down" className={helpTextExpanded ? 'expanded' : ''} onClick={() => {
                      setHelpText(!helpTextExpanded);
                    }} />
                  </div>
                </div>
              </div>
            }</div>
          {renderFooter()}
        </div>
        {canSubmit && helpTextExpanded && users.length > 0 &&
          <div className="expanded-text-v3">
            <div className="spacing-bigger">
              To ensure invites are received, please ask your network administrator to whitelist <a href="mailto: notifications@brillder.com" className="text-underline">notifications@brillder.com</a>. They may want the following information:
            </div>
            <div className="light">
              Brillder is the trading name of Scholar 6 Ltd, which is on the UK Register of Learning
            </div>
            <div className="text-center light">
              Providers (UK Provider Reference Number 10090571)
            </div>
          </div>}
      </Dialog>
      <PremiumEducatorDialog isOpen={isPremiumDialogOpen} close={() => setPremium(false)} submit={() => props.history.push(map.StripeEducator)} />
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
