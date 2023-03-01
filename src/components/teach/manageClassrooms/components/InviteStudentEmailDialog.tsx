import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import "./InviteStudentEmailDialog.scss";
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { ClassroomApi } from 'components/teach/service';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';
import { User } from 'model/user';
import { assignToClassByEmails } from 'services/axios/classroom';

interface InviteStudentEmailProps {
  classroom: ClassroomApi;
  isOpen: boolean;
  close(numInvited: number): void;
}

//eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const InviteStudentEmailDialog: React.FC<InviteStudentEmailProps> = (props) => {
  const [helpTextExpanded, setHelpText] = React.useState(false);
  const [canSubmit, setSubmit] = React.useState(true);
  const [submiting, setSubmitting] = React.useState(false);
  const [currentEmail, setCurrentEmail] = React.useState("");
  const [users, setUsers] = React.useState<User[]>([]);

  const getGoogleEmail = (emailString: string) => {
    const regex = /<(.*)>/g; // The actual regex
    const matches = regex.exec(emailString);
    try {
      if (matches) {
        const googleEmail = matches[1];
        if (emailRegex.test(googleEmail)) {
          return googleEmail;
        }
      }
    } catch (e) {
      console.log('can`t parse email');
    }
    return null;
  }

  const addUser = (email: string) => {
    if (!emailRegex.test(email)) {
      const googleEmail = getGoogleEmail(email);
      if (googleEmail) {
        email = googleEmail;
      } else {
        return;
      }
    }
    setCurrentEmail('');
    setUsers(users => [...users, { email } as User]);
    setSubmit(true);
  }

  const onAddUser = React.useCallback(() => {
    if (!emailRegex.test(currentEmail)) {
      return;
    }
    setCurrentEmail('');
    setUsers(users => [...users, { email: currentEmail } as User]);
    setSubmit(true);
  }, [currentEmail]);

  const onSubmit = React.useCallback(async () => {
    if (submiting) { return; }
    setSubmitting(true);

    if (canSubmit === false) {
      return;
    }

    const currentUsers = users;
    if (!emailRegex.test(currentEmail)) {
      if (users.length <= 0) {
        setSubmitting(false);
        return;
      }
    } else {
      setUsers(users => [...users, { email: currentEmail } as User]);
      setCurrentEmail("");
    }


    const res = await assignToClassByEmails(props.classroom, currentUsers.map(u => u.email));
    if (!res) {
      console.log('can`t assign student by email');
    }
    setUsers([]);
    setSubmitting(false);
    props.close(currentUsers.length);
  }, [users, props, currentEmail])

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

  return (
    <Dialog open={props.isOpen} onClose={() => props.close(0)} className="dialog-box light-blue invite-email-dialog">
      <div className="close-button svgOnHover" onClick={() => props.close(0)}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="dialog-header">
        <div className="bold m-b-10">Invite learners by email.</div>
        <div className="text-center f-s-2">You can invite between 1 and 50 learners to a class</div>
        <AutocompleteUsernameButEmail
          currentEmail={currentEmail}
          users={users}
          onAddEmail={onAddUser}
          onChange={email => checkSpaces(email.trim())}
          setUsers={users => {
            setCurrentEmail('');
            setUsers(users as User[]);
          }}
          setEmpty={setSubmit}
        />
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
          className={`btn btn-md bg-theme-orange yes-button r-long ${!canSubmit ? 'invalid' : ''}`}
          onClick={onSubmit}
        >
          <span className="bold">Invite students</span>
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

export default InviteStudentEmailDialog;
