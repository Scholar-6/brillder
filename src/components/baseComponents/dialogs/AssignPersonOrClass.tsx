import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { connect } from 'react-redux';

import './AssignPersonOrClass.scss';
import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/requestFailed';
import { UserBase, UserType } from 'model/user';
import { Classroom } from 'model/classroom';
import { Brick } from 'model/brick';

interface AssignPersonOrClassProps {
  brick: Brick;
  isOpen: boolean;
  close(): void;
  requestFailed(e: string): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [value] = React.useState("");
  const [students, setStudents] = React.useState<UserBase[]>([]);
  const [classes, setClasses] = React.useState<Classroom[]>([]);
  const [autoCompleteOpen, setAutoCompleteDropdown] = React.useState(false);

  useEffect(() => {
    getStudents();
    getClasses(); 
  }, [ value ]);

  const getStudents = async () => {
    const students = await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/users`,
      {
        searchString: value,
        roleFilters: [UserType.Student]
      },
      { withCredentials: true }
    ).then((data: any) => {
      return data.data.pageData;
    })
    .catch(() => {
      props.requestFailed('Can`t get students');
      return [];
    });
    for (let student of students) {
      student.isStudent = true;
    }
    setStudents(students);
  }

  const getClasses = async () => {
    const classrooms = await axios.get(
      `${process.env.REACT_APP_BACKEND_HOST}/classrooms`,
      { withCredentials: true }
    ).then((data: any) => {
      return data.data;
    }).catch(() => {
      props.requestFailed('Can`t get classrooms');
      return [];
    });

    for (let classroom of classrooms) {
      classroom.isClass = true;
    }

    setClasses(classrooms);
  }

  const assignToStudent = async (student: UserBase) => {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignStudents/${props.brick.id}`,
      [student.id],
      { withCredentials: true }
    ).catch(() => {
      props.requestFailed('Can`t assign student to brick');
    });
  }

  const assignToClass = async (classroom: Classroom) => {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignClasses/${props.brick.id}`,
      [classroom.id],
      { withCredentials: true }
    ).catch(() => {
      props.requestFailed('Can`t assign class to brick');
    });
  }

  const hide = () => setAutoCompleteDropdown(false);

  const onClassroomInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {value} = event.target;
    if (value && value.length >= 2) {
      setAutoCompleteDropdown(true);
    } else {
      setAutoCompleteDropdown(false);
    }
  }

  const classroomSelected = (obj: any) => {
    if (obj.isStudent) {
      assignToStudent(obj);
    } else {
      assignToClass(obj);
    }
    props.close();
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue"
    >
      <div className="dialog-header">
        <div>Who would you like to assign this brick to?</div>
        <Autocomplete
          open={autoCompleteOpen}
          options={[...classes, ...students]}
          onChange={(e:any, c: any) => classroomSelected(c)}
          getOptionLabel={(option:any) => option.isStudent ? `Student ${option.firstName} ${option.lastName}` : 'Class ' + option.name}
          renderInput={(params:any) => (
            <TextField
              onBlur={() => hide()}
              {...params}
              onChange={e => onClassroomInput(e)}
              variant="standard"
              label="Subjects: "
              placeholder="Subjects"
            />
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
})

const connector = connect(mapState, mapDispatch);

export default connector(AssignPersonOrClassDialog);
