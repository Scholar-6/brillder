import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import './AssignPersonOrClass.scss';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';
import { UserBase, UserType } from 'model/user';
import { Classroom } from 'model/classroom';
import { Brick } from 'model/brick';

interface AssignPersonOrClassProps {
  brick: Brick;
  isOpen: boolean;
  close(): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [value, setValue] = React.useState("");
  const [students, setStudents] = React.useState<UserBase[]>([]);
  const [classes, setClasses] = React.useState<Classroom[]>([]);
  const [autoCompleteOpen, setAutoCompleteDropdown] = React.useState(false);

  useEffect(() => {
    getStudents();
    getClasses(); 
  }, [ value ]);

  const getStudents = async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/users`,
      {
        searchString: value,
        roleFilters: [UserType.Student]
      },
      { withCredentials: true }
    );
    for (let student of data.pageData) {
      student.isStudent = true;
    }
    setStudents(data.pageData);
  }

  const getClasses = async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/classrooms`,
      {
        searchString: value
      },
      { withCredentials: true }
    );

    for (let classroom of data) {
      classroom.isClass = true;
    }

    setClasses(data);
  }

  const assignToStudent = async (student: UserBase) => {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignStudents/${props.brick.id}`,
      [student.id],
      { withCredentials: true }
    );
  }

  const assignToClass = async (classroom: Classroom) => {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/assignClasses/${props.brick.id}`,
      [classroom.id],
      { withCredentials: true }
    );
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

const connector = connect(mapState);

export default connector(AssignPersonOrClassDialog);
