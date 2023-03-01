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
  const [helpTextExpanded, setHelpText] = React.useState(false);
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
        <div className="text-r324 bold">Enter the name of your class</div>
        <div className="r-class-inputs">
          <input placeholder="Class Name" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <div className="r-regular-center help-text-r423">
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
        <div className="message-box-r5">
          {!canSubmit
            ? 'Please ensure that you have entered all email addresses correctly and pressed enter.'
            : (users.length > 0) && <div className="help-expandable">
              <div className="help-icon-v3">
                <SpriteIcon name="help-icon-v3" />
              </div>
              <div className="help-text">
                <div>Students might not receive invites if your institution</div>
                <div className="text-with-icon">
                  filters emails. <span className="underline bold" onClick={() => {
                    setHelpText(!helpTextExpanded);
                  }}>How to avoid this</span>
                  <SpriteIcon name="arrow-down" className={helpTextExpanded ? 'expanded' : ''} onClick={() => {
                    setHelpText(!helpTextExpanded);
                  }} />
                </div>
              </div>
            </div>
          }
        </div>
        <button
          className={`btn btn-md bg-theme-orange yes-button r-long ${(value === '' || !canSubmit) ? 'invalid' : ''}`}
          onClick={create}
        >
          <span className="bold">Create</span>
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
  );
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });
const connector = connect(mapState);

export default connector(CreateClassDialog);