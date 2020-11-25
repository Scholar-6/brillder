import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { connect } from 'react-redux';

import './AssignPersonOrClass.scss';
import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/requestFailed';
import { UserBase } from 'model/user';
import { Classroom } from 'model/classroom';
import { Brick } from 'model/brick';
import { getClassrooms, getStudents } from 'services/axios/classroom';
import SpriteIcon from '../SpriteIcon';

interface AssignPersonOrClassProps {
  brick: Brick;
  isOpen: boolean;
  success(items: any): void;
  close(): void;
  requestFailed(e: string): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [value] = React.useState("");
  const [selectedObjs, setSelected] = React.useState<any[]>([]);
  const [students, setStudents] = React.useState<UserBase[]>([]);
  const [classes, setClasses] = React.useState<Classroom[]>([]);
  const [autoCompleteOpen, setAutoCompleteDropdown] = React.useState(false);

  const { requestFailed } = props;

  const getAllStudents = React.useCallback(async () => {
    let students = await getStudents();
    if (!students) {
      requestFailed('Can`t get students');
      students = [];
    }

    for (let student of students) {
      student.isStudent = true;
    }
    setStudents(students);
  }, [requestFailed]);

  const getClasses = React.useCallback(async () => {
    let classrooms = await getClassrooms();
    if (!classrooms) {
      requestFailed('Can`t get classrooms');
      classrooms = [];
    }

    if (!classrooms) {
      classrooms = [];
    }

    for (let classroom of classrooms) {
      classroom.isClass = true;
    }

    setClasses(classrooms);
  }, [requestFailed]);

  useEffect(() => {
    getAllStudents();
    getClasses();
  }, [value, getAllStudents, getClasses]);

  const assignToStudents = async (studentsIds: Number[]) => {
    return await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignStudents/${props.brick.id}`,
      {studentsIds },
      { withCredentials: true }
    ).then(() => {
      return true;
    })
    .catch(() => {
      props.requestFailed('Can`t assign student to brick');
      return false;
    });
  }

  const assignToClasses = async (classesIds: Number[]) => {
    return await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignClasses/${props.brick.id}`,
      {classesIds},
      { withCredentials: true }
    ).then(() => {
      return true;
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

  const assign = async () => {
    let classroomIds:Number[] = [];
    let studentIds:Number[] = [];
    for (let obj of selectedObjs) {
      if (obj.isStudent) {
        studentIds.push(obj.id);
      } else {
        classroomIds.push(obj.id);
      }
    }
    let good = true;
    if (studentIds.length > 0) {
      let res = await assignToStudents(studentIds);
      if (!res) {
        good = false;
      }
    }
    if (classroomIds.length > 0) {
      let res = await assignToClasses(classroomIds);
      if (!res) {
        good = false;
      }
    }
    if (good) {
      props.success(selectedObjs);
    } else {
      props.close();
    }
  }

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue assign-dialog">
      <div className="dialog-header">
        <div className="bold">Who would you like to assign this brick to?</div>
        <Autocomplete
          multiple
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
              placeholder="Students and Classes"
            />
          )}
          renderOption={(option: any, { selected }) => (
            <React.Fragment>
              {option.isStudent
                ? <span><span className="bold">Student</span> {option.firstName} {option.lastName}</span>
                : <span><span className="bold">Class</span> {option.name}</span>
              }
            </React.Fragment>
          )}
        />
        <div className="dialog-footer centered-important" style={{justifyContent: 'center'}}>
          <button className="btn btn-md bg-theme-orange yes-button icon-button" onClick={assign} style={{width: 'auto'}}>
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
