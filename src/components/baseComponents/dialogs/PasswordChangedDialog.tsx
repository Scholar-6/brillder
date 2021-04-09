import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";

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
        <div>
          <Avatar className="circle-check bg-green">
            <SpriteIcon name="alert-triangle" className="active text-white stroke-2" />
          </Avatar>
        </div>
        <div>
          <span className="bold">Password changed</span>
          {/* <span className="italic">{`${getEditors2()} will be able to review your changes`}</span> */}
        </div>
      </div>
    </Dialog>
  );
};

export default PasswordChangedDialog;
