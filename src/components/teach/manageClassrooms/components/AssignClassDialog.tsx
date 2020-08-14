import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';

import './AssignClassDialog.scss';
import sprite from 'assets/img/icons-sprite.svg';

import { User } from "model/user";
import { ClassroomApi } from 'components/teach/service';

interface AssignClassProps {
  users: User[];
  isOpen: boolean;
  classrooms: ClassroomApi[];
  submit(classroomId: number): void;
  close(): void;
}

const AssignClassDialog: React.FC<AssignClassProps> = props => {
  const {users, classrooms} = props;
  const [value, setValue] = React.useState("");
  const [filteredClasses, setFilteredClasses] = React.useState(classrooms);
  console.log(filteredClasses, classrooms)

  const renderUserFullNames = () => {
    let tempUsers = users as any;
    let names = "";
    for (let [i, u] of tempUsers.entries()) {
      if (tempUsers.length === i) {
        names += u.firstName + ' ' + u.lastName;
      } else {
        names += u.firstName + ' ' + u.lastName + ', ';
      }
    }
    return names;
  }

  useEffect(() => {setFilteredClasses(classrooms)}, [props]);

  const filterClassrooms = (value: string) => {
    let filtered = classrooms.filter(classroom => {
      const found = classroom.name.search(value);
      return !found;
    });
    setFilteredClasses(filtered);
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog"
    >
      <div className="dialog-header">
        <div className="title">Which class would you like to add these students to?</div>
        <div className="students-box">
          <div className="students-count-box">
          {props.users.length}
          <svg className="svg active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#users"} />
          </svg>
          </div>
          <div className="student-names">Selected: {renderUserFullNames()}</div>
        </div>
        <input onChange={e => filterClassrooms(e.target.value)} />
        <div className="records-box">
          {filteredClasses.map((classroom, i) => {
            return <div key={i} onClick={() => props.submit(classroom.id)}>{classroom.name}</div>
          })}
        </div>
      </div>
    </Dialog>
  );
}

export default AssignClassDialog;
