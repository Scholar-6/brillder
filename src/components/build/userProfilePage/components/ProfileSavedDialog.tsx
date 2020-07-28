import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";

import sprite from "../../../../assets/img/icons-sprite.svg";

interface ProfileSavedProps {
  isOpen: boolean;
  close(): void;
}

const ProfileSavedDialog: React.FC<ProfileSavedProps> = ({ isOpen, close }) => {
  return (
    <Dialog
      open={isOpen}
      onClick={() => close()}
      onClose={() => close()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog-box">
      <div className="dialog-header">
        <div>
          Profile saved
          <Avatar className="save-image">
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#check"} className="text-theme-dark-blue" />
            </svg>
          </Avatar>
        </div>
      </div>
    </Dialog>
  );
};

export default ProfileSavedDialog;
