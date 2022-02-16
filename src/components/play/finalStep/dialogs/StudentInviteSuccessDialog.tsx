
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import './LinkCopiedDialog.scss';

import sprite from "assets/img/icons-sprite.svg";

interface InvitationProps {
  numStudentsInvited: number;
  close(): void;
}

const StudentInviteSuccessDialog: React.FC<InvitationProps> = props => {
  const getCustomText = () => {
    return `Ask your learner${props.numStudentsInvited > 1 ? "s" : ""} to check their emails.`;
  }

  return (
    <Dialog
      open={props.numStudentsInvited > 0}
      onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary={`Invitation${props.numStudentsInvited > 1 ? "s" : ""} Sent!`} className="bold" style={{ minWidth: '30vw' }} />
          <ListItemAvatar>
            <Avatar className="circle-check">
              <svg className="svg active" style={{marginLeft: 0, marginTop: '0.3vw', marginRight: '0.3vw'}}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#send"} className="text-white" />
              </svg>
            </Avatar>
          </ListItemAvatar>
        </ListItem>
        <ListItem>
          <ListItemText primary={getCustomText()} className="italic" style={{ minWidth: '30vw' }} />
        </ListItem>
      </div>
    </Dialog>
  );
};

export default StudentInviteSuccessDialog;
