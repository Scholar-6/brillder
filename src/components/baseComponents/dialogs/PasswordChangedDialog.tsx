import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "../SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  close(): void;
}

const PasswordChangedDialog: React.FC<DialogProps> = props => {
  return (
    <Dialog
      open={props.isOpen} onClick={props.close} onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText
            primary="Password changed"
            className="bold" style={{ minWidth: '30vw' }}
          />
          <ListItemAvatar>
            <Avatar className="circle-check b-green">
              <SpriteIcon name="alert-triangle" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      </div>
    </Dialog>
  );
};

export default PasswordChangedDialog;
