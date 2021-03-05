import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
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
import { Brick } from 'model/brick';
import { getClassrooms, getStudents } from 'services/axios/classroom';
import SpriteIcon from '../SpriteIcon';
import TimeDropdowns from '../timeDropdowns/TimeDropdowns';

interface AssignPersonOrClassProps {
  brick: Brick;
  isOpen: boolean;
  success(items: any[], failed: any[]): void;
  close(): void;
  requestFailed(e: string): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [value] = React.useState("");
  /*eslint-disable-next-line*/
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

    for (let classroom of classrooms) {
      classroom.isClass = true;
    }

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
    let data = { classesIds } as any;
    if (haveDeadline) {
      data.deadline = deadlineDate;
    }
    return await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignClasses/${props.brick.id}`,
      data,
      { withCredentials: true }
    ).then(res => {
      return res.data as any[];
    }).catch(() => {
      props.requestFailed('Can`t assign class to brick');
      return false;
    });
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

  const assign = async () => {
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

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue assign-dialog">
      <div className="dialog-header">
        <div className="r-popup-title bold">Who would you like to assign this brick to?</div>
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
        </div>
        <div className={haveDeadline ? 'r-day-date-row' : 'r-day-date-row r-hidden'}>
          <div>
            <TimeDropdowns onChange={setDeadline} />
          </div>
        </div>
        <div className="dialog-footer centered-important" style={{ justifyContent: 'center' }}>
          <button className="btn btn-md bg-theme-orange yes-button icon-button" onClick={assign} style={{ width: 'auto' }}>
            <div className="centered">
              <span className="label">Assign Brick</span>
              <SpriteIcon name="file-plus" />
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
