import React, { useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import * as QRCode from "qrcode";
import { ListItemIcon, ListItemText, MenuItem, Popper, SvgIcon } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import './AssignPersonOrClass.scss';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';
import { stripHtml } from 'components/build/questionService/ConvertService';
import { Brick, Subject } from 'model/brick';
import { deleteAssignment, getSuggestedByTitles, hasPersonalBricks } from 'services/axios/brick';
import { createClass, getClassById } from 'components/teach/service';
import { assignClasses } from 'services/axios/assignBrick';
import { assignToClassByEmails, deleteClassroom } from 'services/axios/classroom';
import map from 'components/map';

import BrickTitle from 'components/baseComponents/BrickTitle';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import HoverHelp from 'components/baseComponents/hoverHelp/HoverHelp';
import { Classroom } from 'model/classroom';

interface AssignClassProps {
  isOpen: boolean;
  subjects: Subject[];

  classroom?: Classroom;

  submit(classroomId: number): void;
  close(): void;

  user: User;
  history?: any;
}

const PopperCustom = function (props: any) {
  return (<Popper {...props} className="assign-brick-class-poopper" />)
}

const AssignDialog: React.FC<AssignClassProps> = (props) => {
  const [imgBase64, setImageBase64] = useState('');

  const [expandedWarning, expandWarning] = useState(false);

  const [canSubmitV2, setSubmitV2] = useState(true);
  const [closeV2Open, setCloseV2Open] = useState(false);

  const [expandedV3Popup, expandV3Popup] = useState(false);

  const [secondOpen, setSecondOpen] = useState(false);
  const [thirdOpen, setThirdOpen] = useState(false);
  const [value, setValue] = useState("");
  const [canSubmit, setSubmit] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const [classroom, setClassroom] = useState(null as any);

  React.useEffect(() => {
    if (props.classroom) {
      setClassroom(props.classroom);
      setSecondOpen(true);
      setValue(props.classroom.name);
      props.classroom.assignments.sort((c1, c2) => {
        return c1.assignedDate > c2.assignedDate ? -1 : 1;
      });
      setAssignments(props.classroom.assignments);
      setSubmit(true);
    }
  }, [props.classroom]);

  const setPersonal = async () => {
    const hasPersonal = await hasPersonalBricks();
    setHasPersonal(hasPersonal);
  }

  React.useEffect(() => {
    setPersonal();
  }, []);

  const [hasPersonal, setHasPersonal] = useState(false);

  const [assignments, setAssignments] = useState([] as any[]);
  const [bricks, setBricks] = useState([] as any[]);

  const [searchText, setSearchText] = useState('');

  const [currentEmail, setCurrentEmail] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  //eslint-disable-next-line
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const writeQRCode = (str: string) => {
    QRCode.toDataURL(str, {
      width: 600,
      height: 600
    } as QRCode.QRCodeToDataURLOptions, (err, dataURL) => {
      setImageBase64(dataURL);
    });
  }

  const addUser = (email: string) => {
    if (!emailRegex.test(email)) { return; }
    setCurrentEmail('');
    setUsers(users => [...users, { email } as User]);
    setSubmitV2(true);
  }

  const onAddUser = React.useCallback(() => {
    if (!emailRegex.test(currentEmail)) { return; }
    setCurrentEmail('');
    setUsers(users => [...users, { email: currentEmail } as User]);
    setSubmitV2(true);
    //eslint-disable-next-line
  }, [currentEmail]);

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

  const create = async () => {
    if (isSaving) { return; }
    setSaving(true);

    if (canSubmit === false || value === '') {
      return;
    }

    if (value) {
      // creating new class
      if (!classroom) {
        const newClassroom = await createClass(value);
        setClassroom(newClassroom);

        if (newClassroom) {
          // after assigning get class with assignments
          const resultClass = await getClassById(newClassroom.id);
          if (resultClass) {
            setClassroom(resultClass);
          }

          writeQRCode(
            window.location.protocol + '//' + window.location.host + `/${map.QuickassignPrefix}/` + newClassroom.code
          );
        }
      } else {
        // after assigning get class with assignments
        const resultClass = await getClassById(classroom.id);
        if (resultClass) {
          setClassroom(resultClass);
        }
      }
    }
    setSaving(false);
    setThirdOpen(true);
  }

  const createV2 = async (value: string) => {
    if (isSaving) { return; }
    setSaving(true);

    if (canSubmit === false || value === '') {
      return;
    }

    if (value) {
      // creating new class
      if (!classroom) {
        const newClassroom = await createClass(value);
        setClassroom(newClassroom);

        if (newClassroom) {
          writeQRCode(
            window.location.protocol + '//' + window.location.host + `/${map.QuickassignPrefix}/` + newClassroom.code
          );
        }
      } else {
        // after assigning get class with assignments
        const resultClass = await getClassById(classroom.id);
        if (resultClass) {
          setClassroom(resultClass);
        }
      }
    }
    setSaving(false);
    setSecondOpen(true);
  }

  const assignStudentsToBrick = async () => {
    // assign students to class
    const currentUsers = users;
    if (!emailRegex.test(currentEmail)) {
    } else {
      setUsers(users => [...users, { email: currentEmail } as User]);
      currentUsers.push({ email: currentEmail } as User);
      setCurrentEmail("");
    }

    const res = await assignToClassByEmails(classroom, currentUsers.map(u => u.email));

    if (res) {
      props.history.push(`${map.TeachAssignedTab}?classroomId=${classroom.id}&${map.NewTeachQuery}&assignmentExpanded=true`);
    }
    setSecondOpen(false);
    setThirdOpen(false);
    props.submit(classroom.id);
  }

  const closeV2 = () => {
    setCloseV2Open(true);
  }

  const deleteClass = async () => {
    const deleted = await deleteClassroom(classroom.id);
    if (deleted) {
      setCloseV2Open(false);
      props.close();
    }
  }

  return (
    <Dialog
      open={props.isOpen && !secondOpen}
      onClose={props.close}
      className="dialog-box assign-choice-popup"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title-r1 font-18">How would you like to assign this brick?</div>
          <SpriteIcon name="cancel-custom" onClick={props.close} />
        </div>
      </div>
      <div className="icon-text-btn font-16" onClick={() => { }}>
        <div className="flex-center">
          <SpriteIcon name="send-plane" />
        </div>
        <div className="text-container">
          <div className="bold">Quick Assignment</div>
          <div className="">Create a class with a single click and share instantly</div>
        </div>
        <div className="flex-center">
          <SpriteIcon name="arrow-right" className="arrow-right" />
        </div>
      </div>
      <div className="icon-text-btn font-16" onClick={() => { }}>
        <div className="flex-center">
          <SpriteIcon name="bricks-icon" />
        </div>
        <div className="text-container">
          <div className="bold">Create Class</div>
          <div className="">Create a new class with this brick and see additional options</div>
        </div>
        <div className="flex-center">
          <SpriteIcon name="arrow-right" className="arrow-right" />
        </div>
      </div>
      <div className="icon-text-btn font-16" onClick={() => { }}>
        <div className="flex-center">
          <SpriteIcon name="manage-class-icon" />
        </div>
        <div className="text-container">
          <div className="bold">Add to Class</div>
          <div className="">Add this brick to one of your current classes</div>
        </div>
        <div className="flex-center">
          <SpriteIcon name="arrow-right" className="arrow-right" />
        </div>
      </div>
      <div className="dialog-footer">
        <div className="flex-center">
          <SpriteIcon name="info-icon" />
        </div>
        <div className="message-box-r5 font-11">
          You can edit class details later from the Manage Classes menu.
        </div>
      </div>
    </Dialog>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(AssignDialog);
