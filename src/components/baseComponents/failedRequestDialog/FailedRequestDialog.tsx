import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import sprite from "assets/img/icons-sprite.svg";

interface FailedRequestProps {
  isOpen: boolean;
  close(): void;
}

const FailedRequestDialog: React.FC<FailedRequestProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClick={props.close}
      onClose={props.close}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary="Sorry, we've run into a brick wall" className="bold" style={{ minWidth: '30vw' }} />
          <ListItemAvatar>
            <Avatar className="alert-icon">
              <svg className="svg active stroke-2" style={{marginBottom: '0.3vw'}}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#alert-triangle"} />
              </svg>
            </Avatar>
          </ListItemAvatar>
        </ListItem>
        <ListItem>
          <ListItemText primary="Click refresh and see if we can get over it" className="italic" style={{ minWidth: '30vw' }} />
        </ListItem>
      </div>
    </Dialog>
  );
};

export default FailedRequestDialog;
