import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface SendPublisherProps {
  isOpen: boolean;
  close(): void;
}

const SendPublisherSuccessDialog: React.FC<SendPublisherProps> = props => {
  return (
    <Dialog
      open={props.isOpen} onClick={props.close} onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <div>
          <Avatar className="circle-check">
            <SpriteIcon name="send" className="active text-white stroke-2" />
          </Avatar>
        </div>
        <div>
          <span className="bold">Sent to Publisher!</span>
          <span className="italic">Publisher will be able to publish this brick</span>
        </div>
      </div>
    </Dialog>
  );
};

export default SendPublisherSuccessDialog;
