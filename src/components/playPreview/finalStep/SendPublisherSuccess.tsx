import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import sprite from "assets/img/icons-sprite.svg";

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
        <ListItem>
          <ListItemText primary="Sent to Publisher!" className="bold" style={{ minWidth: '30vw' }} />
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
          <ListItemText primary="Publisher will be able to publish this brick" className="italic" style={{ minWidth: '30vw' }} />
        </ListItem>
      </div>
    </Dialog>
  );
};

export default SendPublisherSuccessDialog;
