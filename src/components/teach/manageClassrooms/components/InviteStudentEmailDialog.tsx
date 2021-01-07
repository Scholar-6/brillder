import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';

import "./InviteStudentEmailDialog.scss";
import { Chip } from '@material-ui/core';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { ClassroomApi } from 'components/teach/service';
import axios from 'axios';

interface InviteStudentEmailProps {
  classroom: ClassroomApi;
  isOpen: boolean;
  close(): void;
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const InviteStudentEmailDialog: React.FC<InviteStudentEmailProps> = (props) => {
  const [currentEmail, setCurrentEmail] = React.useState("");
  const [emails, setEmails] = React.useState<string[]>([]);
  const [emailInvalid, setEmailInvalid] = React.useState<boolean>(false);

  const onAddEmail = React.useCallback(() => {
    if (!emailRegex.test(currentEmail)) {
      setEmailInvalid(true);
      return;
    }
    setEmails(emails => [ ...emails, currentEmail]);
    setCurrentEmail("");
  }, [currentEmail]);

  const onDeleteEmail = (email: string) => {
    setEmails(emails => emails.filter(e => e !== email));
  }

  const onSubmit = React.useCallback(async () => {
    const currentEmails = emails;
    if (!emailRegex.test(currentEmail)) {
      if (emails.length <= 0) {
        setEmailInvalid(true);
        return;
      }
    } else {
      setEmails(emails => [ ...emails, currentEmail ]);
      currentEmails.push(currentEmail);
      setCurrentEmail("");
    }
    await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/classrooms/students/${props.classroom.id}/new`,
      { emails: currentEmails },
      { withCredentials: true }
    );
    props.close();
  }, [emails, currentEmail])

  return (
    <Dialog open={props.isOpen} onClose={props.close} className="dialog-box light-blue invite-email-dialog">
      <div className="dialog-header">
        <div className="bold">Invite students by email.</div>
        <div className="chips">
          {emails.map(email => (
            <Chip
              label={email}
              onDelete={() => onDeleteEmail(email)}
            />
          ))}
        </div>
        <TextField
          onChange={e => setCurrentEmail(e.target.value)}
          onKeyPress={e => {
            if(e.key === "Enter") {
              onAddEmail();
            }
          }}
          className="input"
          value={currentEmail}
          variant="standard"
          placeholder="Enter emails here..."
          error={emailInvalid}
          helperText={emailInvalid ? "Email is not valid." : ""}
        />
        <div className="dialog-footer centered-important" style={{justifyContent: 'center'}}>
          <button className="btn btn-md bg-theme-orange yes-button icon-button" style={{width: 'auto'}} onClick={onSubmit}>
            <div className="centered">
              <span className="label">Invite Students</span>
              <SpriteIcon name="ok" />
            </div>
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default InviteStudentEmailDialog;
