import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { UserBase, UserType } from 'model/user';
import { Classroom } from 'model/classroom';
import { Brick } from 'model/brick';
import axios from 'axios';

import './AssignPersonOrClass.scss';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';

interface AssignPersonOrClassProps {
  brick: Brick;
  isOpen: boolean;
  close(): void;
}

const AssignPersonOrClassDialog: React.FC<AssignPersonOrClassProps> = (props) => {
  const [value, setValue] = React.useState("");
  const [students, setStudents] = React.useState<UserBase[]>([]);
  const [classes, setClasses] = React.useState<Classroom[]>([]);

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
    setClasses(data);
  }

  const renderStudent = (student: UserBase) => (
    <div onClick={() => assignToStudent(student)}>{student.firstName} {student.lastName}</div>
  )

  const renderClassroom = (classroom: Classroom) => (
    <div onClick={() => assignToClass(classroom)}>{classroom.name}</div>
  )

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

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue"
    >
      <div className="dialog-header">
        <div>Who would you like to assign this brick to?</div>
        <input value={value} onChange={e => setValue(e.target.value)} />
        <div className="records-box">
          {students.map(renderStudent)}
          {classes.map(renderClassroom)}
        </div>
      </div>
    </Dialog>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  brick: state.brick.brick
});

const connector = connect(mapState);

export default connector(AssignPersonOrClassDialog);
