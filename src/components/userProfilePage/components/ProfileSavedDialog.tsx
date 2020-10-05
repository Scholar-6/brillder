import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import './ProfileSavedDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface ProfileSavedProps {
  isAdmin: boolean;
  isOpen: boolean;
  history: any;
  close(): void;
}

const ProfileSavedDialog: React.FC<ProfileSavedProps> = props => {
  const { close, history } = props;
  const renderLinkButton = () => {
    if (props.isAdmin) {
      return (
        <button
          className="btn btn-md bg-theme-orange yes-button"
          onClick={() => history.push('/users')}
        >
          <span>Manage other users</span>
        </button>
      );
    }
    return (
      <button
        className="btn btn-md bg-theme-orange yes-button"
        onClick={() => history.push('/home')}
      >
        <span>Go to my homepage</span>
      </button>
    );
  }
  return (
    <Dialog
      open={props.isOpen}
      onClick={close}
      onClose={close}
      className="dialog-box profile-saved-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary="Profile saved" />
          <ListItemAvatar>
            <Avatar className="circle-check">
              <SpriteIcon name="check-icon" className="active text-white" />
            </Avatar>
          </ListItemAvatar>
        </ListItem>
      </div>
      <div className="dialog-footer">
        {renderLinkButton()}
        <button className="btn btn-md bg-gray yes-button" onClick={close}>
          <span>Keep editing</span>
        </button>
      </div>
    </Dialog>
  );
};

export default ProfileSavedDialog;
