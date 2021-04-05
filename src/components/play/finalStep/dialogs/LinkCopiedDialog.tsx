import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";

interface ProfileSavedProps {
  isOpen: boolean;
  close(): void;
}

const LinkCopiedDialog: React.FC<ProfileSavedProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClick={props.close}
      onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <div>
          <Avatar className="circle-check">
            <SpriteIcon name="link" className="active text-white" />
          </Avatar>
        </div>
        <div>
          <span className="bold">Link copied!</span>
          <span className="italic">Paste it anywhere you like</span>
        </div>
      </div>
    </Dialog>
  );
};

export default LinkCopiedDialog;
