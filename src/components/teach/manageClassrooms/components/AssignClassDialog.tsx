import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

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
  const [autoCompleteOpen, setAutoCompleteDropdown] = React.useState(false);

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

  const hide = () => setAutoCompleteDropdown(false);
  const classroomSelected = (selected: ClassroomApi) => props.submit(selected.id);

  const onClassroomInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {value} = event.target;
    if (value && value.length >= 2) {
      setAutoCompleteDropdown(true);
    } else {
      setAutoCompleteDropdown(false);
    }
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
        <Autocomplete
          open={autoCompleteOpen}
          options={classrooms}
          onChange={(e:any, c: any) => classroomSelected(c)}
          getOptionLabel={(option:any) => option.name}
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

export default AssignClassDialog;
