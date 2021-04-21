import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Author } from "model/brick";
import { fileUrl } from "components/services/uploadFile";
import './CoverBioDialog.scss';


interface SubjectDialogProps {
  isOpen: boolean;
  user: Author;
  close(): void;
}

const CoverBioDialog: React.FC<SubjectDialogProps> = ({ isOpen, user, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header bio-popup">
        <div className="b-image-container">
          <div className="b-image">
          {user.profileImage ? <img alt="b-image" src={fileUrl(user.profileImage)} /> : <svg />}
          </div>
          <div className="b-name">
            {user.firstName} {user.lastName}
          </div>
        </div>
        {user.bio && <div className="b-bio">{user.bio}</div>}
      </div>
    </Dialog>
  );
};

export default CoverBioDialog;
