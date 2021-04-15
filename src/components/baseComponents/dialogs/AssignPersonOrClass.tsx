import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { InputBase, ListItemIcon, ListItemText, MenuItem, Select, SvgIcon } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { connect } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import './AssignPersonOrClass.scss';
import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/requestFailed';
import { UserBase } from 'model/user';
import { Classroom } from 'model/classroom';
import { AcademicLevelLabels, Brick } from 'model/brick';
import { getClassrooms, getStudents } from 'services/axios/classroom';
import SpriteIcon from '../SpriteIcon';
import TimeDropdowns from '../timeDropdowns/TimeDropdowns';
import { AssignClassData, assignClasses } from 'services/axios/assignBrick';

interface AssignPersonOrClassProps {
  brick: Brick;
  isOpen: boolean;
  success(items: any[], failed: any[]): void;
  close(): void;
  requestFailed(e: string): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [isSaving, setSaving] = React.useState(false);
  const [value] = React.useState("");
  /*eslint-disable-next-line*/
  const [existingClass, setExistingClass] = React.useState(null as any);
  const [isCreating, setCreating] = React.useState(false);
  const [deadlineDate, setDeadline] = React.useState(null as null | Date);
  const [selectedObjs, setSelected] = React.useState<any[]>([]);
  const [students, setStudents] = React.useState<UserBase[]>([]);
  const [classes, setClasses] = React.useState<Classroom[]>([]);
  const [autoCompleteOpen, setAutoCompleteDropdown] = React.useState(false);
  const [haveDeadline, toggleDeadline] = React.useState(null as boolean | null);

  const getAllStudents = React.useCallback(async () => {
    let students = await getStudents();
    if (!students) {
      students = [];
    }

    for (let student of students) {
      student.isStudent = true;
    }
    setStudents(students);
  }, []);

  const getClasses = React.useCallback(async () => {
    let classrooms = await getClassrooms();
    if (!classrooms) {
      classrooms = [];
    }

    if (!classrooms) {
      classrooms = [];
    }

    classrooms = classrooms.filter(c => c.subjectId > 0);

    for (let classroom of classrooms) {
      classroom.isClass = true;
    }

    setExistingClass(classrooms[0]);
    setClasses(classrooms);
  }, []);

  useEffect(() => {
    getAllStudents();
    getClasses();
  }, [value, getAllStudents, getClasses]);

  const assignToStudents = async (studentsIds: Number[]) => {
    let data = { studentsIds } as any;
    if (haveDeadline) {
      data.deadline = deadlineDate;
    }
    return await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignStudents/${props.brick.id}`,
      data,
      { withCredentials: true }
    ).then(res => {
      return res.data as any[];
    }).catch(() => {
      props.requestFailed('Can`t assign student to brick');
      return false;
    });
  }

  const assignToClasses = async (classesIds: Number[]) => {
    let data = { classesIds, deadline: null } as AssignClassData;
    if (haveDeadline && deadlineDate) {
      data.deadline = deadlineDate;
    }
    const res = await assignClasses(props.brick.id, data);
    if (res === false) {
      props.requestFailed('Can`t assign class to brick');
    }
    return res;
  }

  const hide = () => setAutoCompleteDropdown(false);

  const onClassroomInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    if (value && value.length >= 2) {
      setAutoCompleteDropdown(true);
    } else {
      setAutoCompleteDropdown(false);
    }
  }

  const classroomSelected = (objs: any[]) => {
    setSelected(objs);
    setAutoCompleteDropdown(false);
  }

  const getSelectedIds = () => {
    let res = {
      classroomIds: [],
      studentIds: []
    } as any;

    for (let obj of selectedObjs) {
      if (obj.isStudent) {
        res.studentIds.push(obj.id);
      } else {
        res.classroomIds.push(obj.id);
      }
    }
    return res;
  }

  const removeFailedObjs = (failedStudents: any[], failedClasses: any[]) => {
    return selectedObjs.filter(obj => {
      if (obj.isStudent) {
        let found = failedStudents.find(c => c.student.id === obj.id);
        if (found) {
          return false;
        }
      } else {
        let found = failedClasses.find(c => c.classroom.id === obj.id)
        if (found) {
          return false;
        }
      }
      return true;
    });
  }

  const assignToExistingBrick = async () => {
    let data = { classesIds: [existingClass.id], deadline: null } as AssignClassData;
    if (haveDeadline && deadlineDate) {
      data.deadline = deadlineDate;
    }
    const res = await assignClasses(props.brick.id, data);
    if (res) {
      props.success([existingClass], []);
    }
  }

  const createClassAndAssign = async () => {
    const { studentIds, classroomIds } = getSelectedIds();
  
    let failedClasses: any[] = [];
    let failedStudents: any[] = [];
    let failedItems: any[] = [];

    let good = true;
    if (studentIds.length > 0) {
      let res = await assignToStudents(studentIds);
      if (!res) {
        good = false;
      }
      if (res instanceof Array && res.length > 0) {
        failedItems = res;
        failedStudents = res;
      }
    }
    if (classroomIds.length > 0) {
      let res = await assignToClasses(classroomIds);
      if (res === false) {
        good = false;
      }
      if (res instanceof Array && res.length > 0) {
        failedClasses = res;
        failedItems.push(...res);
      }
    }
    if (good) {
    let assignedObjs = Object.assign([], selectedObjs) as any[];
    if (failedItems.length > 0) {
      assignedObjs = removeFailedObjs(failedStudents, failedClasses);
    }
    props.success(assignedObjs, failedItems);
    } else {
    props.close();
    }
  }

  const assign = async () => {
    // prevent from double click
    if (isSaving) { return; }
    setSaving(true);

    if (isCreating == false) {
      assignToExistingBrick();
    } else {
      createClassAndAssign();
    }
  }

  const renderNew = () => {
    return (
      <Autocomplete
        multiple
        freeSolo
        open={autoCompleteOpen}
        options={[...classes, ...students]}
        onChange={(e: any, c: any) => classroomSelected(c)}
        getOptionLabel={(option: any) => option.isStudent ? `Student ${option.firstName} ${option.lastName} (${option.username})` : 'Class ' + option.name}
        renderInput={(params: any) => (
          <TextField
            onBlur={() => hide()}
            {...params}
            onChange={e => onClassroomInput(e)}
            variant="standard"
            label="Students and Classes: "
            placeholder="Search for students and classes"
          />
        )}
        renderOption={(option: any) => (
          <React.Fragment>
            {option.isStudent
              ? <span><span className="bold">Student</span> {option.firstName} {option.lastName}</span>
              : <span><span className="bold">Class</span> {option.name}</span>
            }
          </React.Fragment>
        )}
      />
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
        <div className="brick-level">Level {AcademicLevelLabels[props.brick.academicLevel]}</div>
      </div>
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
        <div className="dialog-footer centered-important" style={{ justifyContent: 'center' }}>
          <button className="btn btn-md bg-theme-orange yes-button icon-button r-long" onClick={assign} style={{ width: 'auto' }}>
            <div className="centered">
              <span className="label">Assign</span>
            </div>
          </button>
        </div>
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
