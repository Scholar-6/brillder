import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "../SpriteIcon";

interface ProfileSavedProps {
  isOpen: boolean;
  close(): void;
  toPersonal(): void;
}

const APublishSuccessDialog: React.FC<ProfileSavedProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClick={props.close}
      onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary="Changes complete!" className="bold" style={{ minWidth: '30vw' }} />
          <ListItemAvatar>
            <Avatar className="circle-check">
              <SpriteIcon name="award" className="active stroke-2 text-white" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
        <ListItem>
          <ListItemText primary="Your adapted Brick has been saved to your Personal List" className="italic" style={{ minWidth: '30vw' }} />
        </ListItem>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-gray no-button" onClick={props.close}>
          <span>Return to Cover</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={props.toPersonal}>
          <span>See Personal Bricks</span>
        </button>
      </div>
    </Dialog>
  );
};

export default APublishSuccessDialog;
