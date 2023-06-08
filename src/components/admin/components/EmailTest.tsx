import React from "react";
import { Dialog } from '@material-ui/core';
import { ListItemText, MenuItem, Select } from '@material-ui/core';
import './EmailTest.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { adminSendTestEmail } from "services/axios/admin";

enum EmailType {
  AssignmentReminder = 1,
  BrickAssigned,
  NewBrickPublished,
  BrickPublished,
  BrickReturnedToAuthorByEditor,
  BrickSharedAuth,
  BrickSharedUnAuth,
  StudentInvitedToClassAuth,
  StudentInvitedToClassUnAuth,
  CompetitionWinner,
  InvitationToEdit,
  ResetPassword,
  WelcomeSignup,
  TestEmail,
  PersonalBrickShared
}

const EmailTestBtn: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [isOpen, setOpen] = React.useState(false);

  const [emailType, setEmailType] = React.useState(EmailType.AssignmentReminder);

  const emailTypes = [{
      type: EmailType.AssignmentReminder,
      name: 'Assignment Reminder'
    }, {
      type: EmailType.BrickAssigned,
      name: 'Brick Assigned'
    }, {
      type: EmailType.BrickPublished,
      name: 'Brick Published'
    }, {
      type: EmailType.NewBrickPublished,
      name: 'New Brick Published'
    }, {
      type: EmailType.BrickReturnedToAuthorByEditor,
      name: 'Brick Returned To Author By Editor'
    }, {
      type: EmailType.BrickSharedAuth,
      name: 'Brick Shared Auth'
    }, {
      type: EmailType.BrickSharedUnAuth,
      name: 'Brick Shared Unauth'
    }, {
      type: EmailType.StudentInvitedToClassAuth,
      name: 'Student Invited To Class Auth'
    }, {
      type: EmailType.StudentInvitedToClassUnAuth,
      name: 'Student Invited To Class Unauth'
    }, {
      type: EmailType.CompetitionWinner,
      name: 'Send Competition Winner'
    }, {
      type: EmailType.InvitationToEdit,
      name: 'Send Invitation To Edit'
    }, {
      type: EmailType.ResetPassword,
      name: 'Reset Password'
    }, {
      type: EmailType.WelcomeSignup,
      name: 'Welcome Signup'
    }, {
      type: EmailType.TestEmail,
      name: 'Test Email'
    }, {
      type: EmailType.PersonalBrickShared,
      name: 'Personal Brick Shared'
    }
  ];

  const sendEmail = async () => {
    const res = await adminSendTestEmail(email, emailType);
    if (res) {
      setOpen(false);
    }
  }

  return (
    <div className="btn-container margin-right-small">
      <div className="btn btn-blue flex-center" onClick={() => setOpen(true)}>
        <div>Test Email</div>
        <SpriteIcon name="email" />
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setOpen(false)}
        className="dialog-box adding-credits-dialog email-test-popup"
      >
        <div className="close-button svgOnHover" onClick={() => setOpen(false)}>
          <SpriteIcon name="cancel-thick" className="active" />
        </div>
        <div className="dialog-header">
          <div>Type email and select email type</div>
        </div>
        <div className="input-block">
          <input
            type="email" name="email"
            style={{paddingTop: 0, paddingBottom: 0}}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-block" >
          <Select
            className="select-multiple-subject"
            style={{width: '100%'}}
            MenuProps={{ classes: { paper: 'select-classes-list' } }}
            value={emailType}
            onChange={(e: any) => setEmailType(e.target.value)}
          >
            {emailTypes.map((s: any, i) =>
              <MenuItem value={s.type} key={i}>
                <ListItemText>{s.name}</ListItemText>
              </MenuItem>
            )}
          </Select>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-green yes-button"
            onClick={() => sendEmail()}>
            <span>Send Test Email</span>
          </button>
        </div>
      </Dialog>
    </div>
  )
}

export default EmailTestBtn;
