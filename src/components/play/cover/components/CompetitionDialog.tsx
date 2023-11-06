import React from 'react';
import { Dialog } from "@material-ui/core";
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { User, UserPreferenceType } from 'model/user';

interface Props {
  isOpen: boolean;
  user: User | undefined;
  onSubmit(): void;
  onClose(): void;
}

const CompetitionDialog: React.FC<Props> = ({ isOpen, user, onSubmit, onClose }) => {
  if (user?.userPreference?.preferenceId === UserPreferenceType.Teacher) {
    return <div />;
  }

  return (
    <Dialog open={isOpen} className="dialog-box phone-competition-dialog" onClose={onClose}>
      <div className="dialog-header phone-competition">
        <div className="flex-center">
          <SpriteIcon name="star-empty" className="big-star" />
        </div>
        <div className="bold" style={{ textAlign: 'center' }}>
          This brick is part of a competition. <br />
          If you do well, you could win bonus brills!
        </div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md  bg-green text-white yes-button" onClick={onSubmit}>
          <span>Start Playing</span>
        </button>
      </div>
      <div className="italic bottom-link flex-center" style={{ textAlign: 'center' }}>
        <SpriteIcon name="eye-on" />
        <a rel="noopener noreferrer" href="https://brillder.com/brilliant-minds-prizes/" target="_blank">Learn more on our competition page</a>
      </div>
    </Dialog>
  );
};

export default CompetitionDialog;
