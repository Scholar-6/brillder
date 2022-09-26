import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "../SpriteIcon";

interface ProfileSavedProps {
  isOpen: boolean;
  isPersonal?: boolean;
  draftCopy?(e: any): void;
  close(): void;
}

const PublishSuccessDialog: React.FC<ProfileSavedProps> = props => {
  if (props.isPersonal) {
    return (
      <Dialog
        open={props.isOpen}
        onClick={props.close}
        onClose={props.close}
        className="dialog-box link-copied-dialog personal-publish"
      >
        <div className="dialog-header">
          <ListItem>
            <ListItemText primary="Brick Uploaded!" className="bold" style={{ minWidth: '30vw' }} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Your brick has been saved to your personal catalogue." className="italic" style={{ minWidth: '30vw' }} />
          </ListItem>
        </div>
        <ListItem className="bottom-personal-publish">
            <div>
              <ListItemText primary="Do you think your brick is good enough for the public catalogue?" className="italic" style={{ minWidth: '30vw' }} />
              <ListItemText primary="Submit to an editor to find out" className="bold" style={{ minWidth: '30vw' }} />
            </div>
            <ListItemAvatar>
              <Avatar className="circle-check" onClick={(e) => props.draftCopy?.(e)}>
                <SpriteIcon name="globe" className="active stroke-2 text-white" />
              </Avatar>
            </ListItemAvatar>
          </ListItem>
      </Dialog>
    );
  }
  return (
    <Dialog
      open={props.isOpen}
      onClick={props.close}
      onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary="Successfully Published!" className="bold" style={{ minWidth: '30vw' }} />
          <ListItemAvatar>
            <Avatar className="circle-check">
              <SpriteIcon name="award" className="active stroke-2 text-white" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
        <ListItem>
          <ListItemText primary="Thank you for adding to our library" className="italic" style={{ minWidth: '30vw' }} />
        </ListItem>
      </div>
    </Dialog>
  );
};

export default PublishSuccessDialog;
