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

const LibrarySuccessDialog: React.FC<DialogProps> = ({ isOpen, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary="You successfully connected to your Library. You can now play for free. Competitions will still require paid credits." className="bold" style={{ maxWidth: '50vw' }} />
          <ListItemAvatar>
            <Avatar className="circle-check">
              <SpriteIcon name="award" className="active stroke-2 text-white" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      </div>
    </Dialog>
  );
};

export default LibrarySuccessDialog;
