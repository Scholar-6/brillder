
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface InvitationProps {
  numStudentsInvited: number;
  close(): void;
}

const StudentInviteSuccessDialog: React.FC<InvitationProps> = props => {
  const getCustomText = () => {
    return `Ask your student${props.numStudentsInvited > 1 ? "s" : ""} to check their emails.`;
  }

  return (
    <Dialog
      open={props.numStudentsInvited > 0}
      onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <div>
          <Avatar className="circle-check">
            <SpriteIcon name="send" className="active text-white" />
          </Avatar>
        </div>
        <div>
          <span className="bold">{`Invitation${props.numStudentsInvited > 1 ? "s" : ""} Sent!`}</span>
          <span className="italic">{getCustomText()}</span>
        </div>
      </div>
    </Dialog>
  );
};

export default StudentInviteSuccessDialog;
