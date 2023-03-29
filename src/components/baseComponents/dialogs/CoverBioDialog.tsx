import React from "react";
import { useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";

import { Author, Editor } from "model/brick";
import { fileUrl } from "components/services/uploadFile";
import './CoverBioDialog.scss';
import map from "components/map";
import { isPhone } from "services/phone";
import { User } from "model/user";


interface SubjectDialogProps {
  isOpen: boolean;
  user: Editor | User | Author;
  onlyLibrary?: boolean;
  setLibraryLogin?(): void;
  close(): void;
}

const CoverBioDialog: React.FC<SubjectDialogProps> = ({ isOpen, setLibraryLogin, onlyLibrary, user, close }) => {
  const history = useHistory();

  const renderName = () => {
    const name = user.firstName;
    if (name && name[name.length - 1] === 's') {
      return `${name}'`;
    }
    return `${name}'s`;
  }

  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box">
      <div className="dialog-header bio-popup">
        <div className="b-image-container">
          <div className="b-image">
            {user.profileImage ? <img alt="b-imge" src={fileUrl(user.profileImage)} /> : <svg />}
          </div>
          <div className="b-name">
            {user.firstName} {user.lastName}
          </div>
          <div className="btn btn-md text-white pointer" onClick={() => {
            if (onlyLibrary && setLibraryLogin) {
              close();
              setLibraryLogin();
            } else {
              if (isPhone()) {
                history.push(map.SearchPublishBrickPage + '?searchString=' + user.firstName + '&searchUserId=' + user.id);
              } else {
                history.push(map.ViewAllPageB + '&newTeacher=true&searchString=' + user.firstName + ' ' + user.lastName + '&searchUserId=' + user.id);
              }
            }
          }}>See all of {renderName()} bricks</div>
        </div>
        {user.bio && <div className="b-bio">{user.bio}</div>}
      </div>
    </Dialog>
  );
};

export default CoverBioDialog;
