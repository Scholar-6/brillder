import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Author } from "model/brick";
import { fileUrl } from "components/services/uploadFile";
import './CoverBioDialog.scss';
import { useHistory } from "react-router-dom";
import map from "components/map";
import { isPhone } from "services/phone";


interface SubjectDialogProps {
  isOpen: boolean;
  user: Author;
  close(): void;
}

const CoverBioDialog: React.FC<SubjectDialogProps> = ({ isOpen, user, close }) => {
  const history = useHistory();

  const renderName = () => {
    const name = user.firstName;
    if (name[name.length-1] === 's') {
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
            if (isPhone()) {
              history.push(map.SearchPublishBrickPage + '?searchString=' + user.firstName);
            } else {
              history.push(map.ViewAllPage + '?mySubject=true&newTeacher=true&searchString=' + user.firstName);
            }
          }}>See all of {renderName()} bricks</div>
        </div>
        {user.bio && <div className="b-bio">{user.bio}</div>}
      </div>
    </Dialog>
  );
};

export default CoverBioDialog;
