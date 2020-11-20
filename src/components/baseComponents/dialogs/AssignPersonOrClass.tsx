import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { connect } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';

import './AssignPersonOrClass.scss';
import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/requestFailed';
import { UserBase } from 'model/user';
import { Classroom } from 'model/classroom';
import { Brick } from 'model/brick';
import { getClassrooms, getStudents } from 'services/axios/classroom';

interface AssignPersonOrClassProps {
  brick: Brick;
  isOpen: boolean;
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

    classrooms = classrooms.filter(s => s.students.length > 0);

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
    await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignStudents/${props.brick.id}`,
      {studentsIds },
      { withCredentials: true }
    ).catch(() => {
      props.requestFailed('Can`t assign student to brick');
    });
  }

  const assignToClasses = async (classesIds: Number[]) => {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignClasses/${props.brick.id}`,
      {classesIds},
      { withCredentials: true }
    ).catch(() => {
      props.requestFailed('Can`t assign class to brick');
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
  }

  const assign = (e: any) => {
    let classroomIds:Number[] = [];
    let studentIds:Number[] = [];
    for (let obj of selectedObjs) {
      if (obj.isStudent) {
        studentIds.push(obj.id);
      } else {
        classroomIds.push(obj.id);
      }
    }
    if (studentIds.length > 0) {
      assignToStudents(studentIds);
    }
    if (classroomIds.length > 0) {
      assignToClasses(classroomIds);
    }
    props.close();
  }

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue">
      <div className="dialog-header">
        <div className="bold">Who would you like to assign this brick to?</div>
        <Autocomplete
          multiple
          open={autoCompleteOpen}
          onBlur={e => assign(e)}
          options={[...classes, ...students]}
          onChange={(e: any, c: any) => classroomSelected(c)}
          getOptionLabel={(option: any) => option.isStudent ? `Student ${option.firstName} ${option.lastName}` : 'Class ' + option.name}
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
              <Checkbox
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.isStudent ? `Student ${option.firstName} ${option.lastName}` : 'Class ' + option.name}
            </React.Fragment>
          )}
        />
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
