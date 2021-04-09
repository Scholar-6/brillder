import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface SuccessDialogProps {
  isOpen: boolean;
  header: string;
  isDeadlinePassed: boolean;
  close(): void;
}

const ReminderSuccessDialog: React.FC<SuccessDialogProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClick={props.close}
      onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <div>
          <Avatar className={`circle-check ${props.isDeadlinePassed ? "bg-theme-orange" : "b-yellow"}`}>
            <SpriteIcon name="reminder" className="active text-white stroke-2" />
          </Avatar>
        </div>
        <div>
          <span className="bold">{props.header}</span>
          {/* <span className="italic">Thank you for adding to our library</span> */}
        </div>
      </div>
    </Dialog>
  );
};

export default ReminderSuccessDialog;
