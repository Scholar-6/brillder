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

const LibraryFailedDialog: React.FC<DialogProps> = ({ isOpen, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary='That did not work. Please try again, or select "other" and suggest a Library and we will check if they have a partnership scheme with Brillder.' className="bold" style={{ maxWidth: '50vw' }} />
          <ListItemAvatar>
            <Avatar className="circle-check alert-icon">
              <SpriteIcon name="alert-triangle" className="active stroke-2 m-b-03" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      </div>
    </Dialog>
  );
};

export default LibraryFailedDialog;
