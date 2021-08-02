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

const BrickCopiedDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog
      open={props.isOpen} onClick={props.close} onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText
            primary="A copy of this brick has been created and is in the ‘Draft’ column in the 'Public' build tab"
            className="bold" style={{ minWidth: '30vw' }}
          />
          
          <ListItemAvatar>
            <Avatar className="circle-check">
              <SpriteIcon name="award" className="active stroke-2 text-white" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      </div>
    </Dialog>
  );
}

export default BrickCopiedDialog;
