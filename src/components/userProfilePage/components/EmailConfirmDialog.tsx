import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface SubjectDialogProps {
  isOpen: boolean;
  email: string;
  success(): void;
  close(): void;
}

const EmailConfirmDialog: React.FC<SubjectDialogProps> = ({ isOpen, close, ...props }) => {
  const [email, setEmail] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  return (
    <div>
      <Dialog open={isOpen} onClose={close} className="dialog-box confirm-email">
        <div className="dialog-header">
          <div>
            Please enter your current email address
          </div>
          <input className="input-block" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-gray yes-button" onClick={() => {
            if (email == props.email) {
              setSuccess(true);
            } else {
              setFailed(true);
            }
          }}>
            <span>Confirm</span>
          </button>
        </div>
      </Dialog>
      <Dialog open={failed} onClose={() => setFailed(false)} className="dialog-box">
        <div className="dialog-header" style={{ marginBottom: 0 }}>
          <ListItem>
            <ListItemText
              primary="The email address you entered does not match our records. You must correctly enter your current email address before making a change."
              className="bold"
              style={{ minWidth: '30vw', maxWidth: '40vw' }}
            />
            <ListItemAvatar style={{ padding: 0 }}>
              <Avatar className="circle-orange">
                <SpriteIcon name="alert-triangle" className="active text-white stroke-2 w-3 m-b-02" />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
          <div></div>
        </div>
      </Dialog>
      <Dialog open={success} onClose={() => {
        setSuccess(false);
        props.success();
        close();
      }} className="dialog-box">
        <div className="dialog-header" style={{ marginBottom: 0 }}>
          <ListItem>
            <ListItemText
              primary="Thank you, please enter your new email address"
              className="bold"
              style={{ minWidth: '30vw' }}
            />
            <ListItemAvatar style={{ padding: 0 }}>
              <Avatar className="circle-green">
                <SpriteIcon name="link" className="active text-white stroke-2 w-3 m-b-02" />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
          <div></div>
        </div>
      </Dialog>
    </div>
  );
};

export default EmailConfirmDialog;
