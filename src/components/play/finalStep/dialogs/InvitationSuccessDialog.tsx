import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface InvitationProps {
  isOpen: boolean;
  name: string;
  isAuthor: boolean;
  accessGranted: boolean;
  close(): void;
}

const InvitationSuccessDialog: React.FC<InvitationProps> = props => {
  const getCustomText = () => {
    if (props.accessGranted) {
      return props.name + " will be able to suggest edits to your brick";
    }
    if (props.isAuthor) {
      return `${props.name} will be able to play your brick`;
    }
    return `${props.name} will be able to play this brick`;
  }

  return (
    <Dialog
      open={props.isOpen}
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
          <span className="bold">Invitation Sent!</span>
          <span className="italic">{getCustomText()}</span>
        </div>
      </div>
    </Dialog>
  );
};

export default InvitationSuccessDialog;
