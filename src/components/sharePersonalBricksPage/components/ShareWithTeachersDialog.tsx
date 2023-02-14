import React from 'react';
import Dialog from '@material-ui/core/Dialog';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import AutocompleteUsernameButEmail from 'components/play/baseComponents/AutocompleteUsernameButEmail';
import { User } from 'model/user';
import { Brick } from 'model/brick';
import { sharedPersonalBricks } from 'services/axios/brick';

interface InviteStudentEmailProps {
  isOpen: boolean;
  selectedBricks: Brick[];
  close(numInvited: number): void;
}

//eslint-disable-next-line
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ShareWithTeachersDialog: React.FC<InviteStudentEmailProps> = (props) => {

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
  }

  const onAddUser = React.useCallback(() => {
    if (!emailRegex.test(currentEmail)) {
      return;
    }
    setCurrentEmail('');
    setUsers(users => [...users, { email: currentEmail } as User]);
  }, [currentEmail]);

  const onSubmit = React.useCallback(async () => {
    setSubmitting(true);
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

    console.log('shared users', currentUsers);

    const res = await sharedPersonalBricks(props.selectedBricks.map(b => b.id), currentUsers.map(u => u.email));

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
        <div className="bold m-b-10">Share your personal bricks with others.</div>
        <AutocompleteUsernameButEmail
          currentEmail={currentEmail}
          users={users}
          onAddEmail={onAddUser}
          onChange={email => checkSpaces(email.trim())}
          setUsers={users => {
            setCurrentEmail('');
            setUsers(users as User[]);
          }}
        />
        <div className="dialog-footer centered-important" style={{ justifyContent: 'center' }}>
          <button className={`btn btn-md yes-button icon-button ${submiting ? 'b-dark-blue' : 'bg-theme-orange'}`} style={{ width: 'auto' }} onClick={onSubmit}>
            <div className="centered">
              <span className="label">Share</span>
              {submiting ? <div className="loader-container ">
                <SpriteIcon name="f-loader" className="spinning" />
              </div> : <SpriteIcon name="send" />}
            </div>
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ShareWithTeachersDialog;
