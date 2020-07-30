import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import './ProfileSavedDialog.scss';

import sprite from "assets/img/icons-sprite.svg";

interface ProfileSavedProps {
  isOpen: boolean;
  history: any;
  close(): void;
}

const ProfileSavedDialog: React.FC<ProfileSavedProps> = ({ isOpen, history, close }) => {
  return (
    <Dialog
      open={isOpen}
      onClick={() => close()}
      onClose={() => close()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog-box profile-saved-dialog"
    >
      <div className="dialog-header">
        <ListItem>
          <ListItemText primary="Profile saved" />
          <ListItemAvatar>
          <Avatar className="circle-check">
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#check-icon"} className="text-white" />
            </svg>
          </Avatar>
          </ListItemAvatar>
        </ListItem>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange  yes-button"
          onClick={() => history.push('/home')}>
          <span>Go to my homepage</span>
        </button>
        <button className="btn btn-md bg-gray yes-button"
          onClick={() => close()}>
          <span>Continue editing</span>
        </button>
      </div>
    </Dialog>
  );
};

export default ProfileSavedDialog;
