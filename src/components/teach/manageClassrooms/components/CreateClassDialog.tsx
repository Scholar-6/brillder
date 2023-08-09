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
  const [secondOpen, setSecondOpen] = React.useState(false);
  const [helpTextExpanded, setHelpText] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [canSubmit, setSubmit] = React.useState(false);
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
    setSubmit(true);
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
    setSaving(false);
  }

  return (<div>
    <Dialog
      open={props.isOpen && !secondOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title">New Class</div>
          <SpriteIcon name="cancel-custom" onClick={props.close} />
        </div>
        <div className="text-block">
          <div className="text-r324">Enter the name of your class</div>
          <div className="r-class-inputs">
            <input placeholder="Class Name" value={value} onChange={e => {
              if (canSubmit === false && value.length > 0) {
                setSubmit(true);
              } else if (canSubmit === false && value.length === 0) {
                setSubmit(false);
              }
              setValue(e.target.value)
            }} />
          </div>
        </div>
      </div>
      <div className="dialog-footer">
        <div className="info-box">
          <SpriteIcon name="info-icon" />
        </div>
        <div className="message-box-r5">
          Add a name that will be recognisable later to you and to your students, for example: Year 11 French 2023.
        </div>
        <button
          className="btn btn-md cancel-button"
          onClick={props.close}
        >
          <span className="bold">Cancel</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green yes-button ${(value === '' || !canSubmit) ? 'invalid' : ''}`}
          onClick={() => {
            if (canSubmit) {
              setSecondOpen(true)
            }
          }}
        >
          <span className="bold">Next</span>
        </button>
      </div>
      {canSubmit && helpTextExpanded && users.length > 0 &&
        <div className="expanded-text-v3">
          <div className="justify">
            To ensure invites are received, please ask your network administrator to whitelist <a href="mailto: notifications@brillder.com" className="text-underline">notifications@brillder.com</a>. They may want the following information:
          </div>
          <div className="light">
            Brillder is the trading name of Scholar 6 Ltd, which is on the UK Register of Learning
          </div>
          <div className="text-center light">
            Providers (UK Provider Reference Number 10090571)
          </div>
        </div>}
    </Dialog>
    <Dialog
      open={props.isOpen && secondOpen}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title">
            Add Assignment to Class
          </div>
          <SpriteIcon onClick={props.close} name="cancel-custom" />
        </div>
        <div className="text-block">
          <div className="text-r324">
            If you have the title you’re looking for enter it below
          </div>
        </div>
      </div>
      <div className="dialog-footer">
        <div className="info-box">
          <SpriteIcon name="info-icon" />
        </div>
        <div className="message-box-r5">
          If you have the title you’re looking for enter it below
        </div>
        <div></div>
        <button
          className="btn btn-md cancel-button"
          //onClick={cancel}
        >
          <span className="bold">Cancel</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green yes-button ${(value === '' || !canSubmit) ? 'invalid' : ''}`}
          onClick={() => { }}
        >
          <span className="bold">Next</span>
        </button>
      </div>
      {canSubmit && helpTextExpanded && users.length > 0 &&
        <div className="expanded-text-v3">
          <div className="justify">
            To ensure invites are received, please ask your network administrator to whitelist <a href="mailto: notifications@brillder.com" className="text-underline">notifications@brillder.com</a>. They may want the following information:
          </div>
          <div className="light">
            Brillder is the trading name of Scholar 6 Ltd, which is on the UK Register of Learning
          </div>
          <div className="text-center light">
            Providers (UK Provider Reference Number 10090571)
          </div>
        </div>}
    </Dialog>
  </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(CreateClassDialog);