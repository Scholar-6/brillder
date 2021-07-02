import React from "react";
import { Dialog } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import './SendToPublisherDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  close(): void;
}

const SendToPublisher2Dialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog
      open={props.isOpen} onClick={props.close} onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText
            primary="We want to make sure each brick is as enjoyable and fair as it can possibly be."
            className="bold" style={{ minWidth: '30vw' }}
          />
          
          <ListItemAvatar>
            <Avatar className="circle-check bg-theme-orange">
              <SpriteIcon name="alert-triangle" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
        <ListItemText
            primary="Please check all boxes before submitting this brick for publication."
            className="italic" style={{ minWidth: '30vw', paddingLeft: '16px' }}
          />
      </div>
    </Dialog>
  );
}

export default SendToPublisher2Dialog;
