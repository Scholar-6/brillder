import React from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';

import './CreateClassDialog.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User } from 'model/user';
import { ReduxCombinedState } from 'redux/reducers';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';

interface AssignClassProps {
  isOpen: boolean;
  submit(value: string, users: User[]): void;
  close(): void;

  user: User;
}

const CreateClassDialog: React.FC<AssignClassProps> = (props) => {
  const [value, setValue] = React.useState("");
  const [canSubmit, setSubmit] = React.useState(true);
  const [isSaving, setSaving] = React.useState(false);

  const [currentEmail, setCurrentEmail] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);

  //eslint-disable-next-line
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const addUser = (email: string) => {
    if (!emailRegex.test(email)) { return; }
    setCurrentEmail('');
    setUsers(users => [...users, { email } as User]);
    setSubmit(true);
  }

  const onAddUser = React.useCallback(() => {
    if (!emailRegex.test(currentEmail)) { return; }
    setCurrentEmail('');
    setUsers(users => [...users, { email: currentEmail } as User]);
    //eslint-disable-next-line
  }, [currentEmail]);

  const checkSpaces = (email: string) => {
    const emails = email.split(' ');
    if (emails.length >= 2) {
      for (let email of emails) {
        addUser(email);
      }
    } else {
      setCurrentEmail(email.trim());
    }
  }

  const create = () => {
    if (isSaving) { return; }
    setSaving(true);

    if (canSubmit === false || value === '') {
      return;
    }

    if (value) {
      props.submit(value, users);
      setValue('');
    }
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog"
    >
      <div className="close-button svgOnHover" onClick={props.close}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="dialog-header">
        <div className="title">Create New Class</div>
        <div className="regular">Enter the name of your class</div>
        <div className="r-class-inputs">
          <input placeholder="Class Name" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className="r-regular-center help-text-r423 flex-center">
          Invite your students below. Or, leave blank to set bricks before inviting students.
        </div>
        <div className="r-student-emails">
          <AutocompleteUsernameButEmail
            placeholder="Type or paste up to 50 learner emails, then press Enter ⏎"
            currentEmail={currentEmail}
            users={users}
            onAddEmail={onAddUser}
            onChange={email => checkSpaces(email.trim())}
            setUsers={users => {
              setCurrentEmail('');
              setUsers(users as User[]);
            }}
            isEmpty={canSubmit}
            setEmpty={setSubmit}
          />
        </div>
      </div>
      <div className="dialog-footer">
        <button
          className={`btn btn-md bg-theme-orange yes-button r-long ${(value === '' || !canSubmit) ? 'invalid' : ''}`}
          onClick={create}
        >
          <span className="bold">Create</span>
        </button>
      </div>
    </Dialog>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(CreateClassDialog);