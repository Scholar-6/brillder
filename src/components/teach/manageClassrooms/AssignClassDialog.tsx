import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import './AssignClassDialog.scss';
import sprite from 'assets/img/icons-sprite.svg';

import { User } from "model/user";

interface AssignClassProps {
  users: User[];
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const AssignClassDialog: React.FC<AssignClassProps> = (props) => {
  const {users} = props;
  const [value, setValue] = React.useState("");

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
        <input value={value} onChange={e => setValue(e.target.value)} />
        <div className="records-box">
        </div>
      </div>
    </Dialog>
  );
}

export default AssignClassDialog;
