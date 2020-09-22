import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import './LinkCopiedDialog.scss';

import sprite from "assets/img/icons-sprite.svg";

interface InvitationProps {
  isOpen: boolean;
  name: string;
  isAuthor: boolean;
  accessGranted: boolean;
  close(): void;
}

const InvitationSuccessDialog: React.FC<InvitationProps> = props => {
  const getCustomText = () => {
    if (props.accessGranted) {
      return props.name + " will be able to suggest edits to your brick";
    }
    if (props.isAuthor) {
      return `${props.name} will be able to play your brick`;
    }
    return `${props.name} will be able to play this brick`;
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
          <ListItemText primary="Invitation Sent!" className="bold" style={{ minWidth: '30vw' }} />
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
          <ListItemText primary={getCustomText()} className="italic" style={{ minWidth: '30vw' }} />
        </ListItem>
      </div>
    </Dialog>
  );
};

export default InvitationSuccessDialog;
