import React from "react";
import Dialog from "@material-ui/core/Dialog";

import './PremiumLearnerDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface InvitationProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const PremiumLearnerDialog: React.FC<InvitationProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box premium-educator-dialog bold"
    >
      <div className="flex-center premium-label">
        Go Premium <SpriteIcon name="hero-sparkle" />
        <div className="absolute-label">
          Learners
        </div>
      </div>
      <div className="list">
        <div>
          <SpriteIcon name="check-icon" className="text-green" />
          Earn prize money if you win a challenge
        </div>
        <div>
          <SpriteIcon name="check-icon" className="text-green" />
          Collect unlimited books in your library
        </div>
        <div>
          <SpriteIcon name="check-icon" className="text-green" />
          Priority Feature Requests
        </div>
      </div>
      <div className="flex-center">
        <div className="green-btn" onClick={() => props.submit()}>
          Upgrade Now
        </div>
      </div>
    </Dialog>
  );
};

export default PremiumLearnerDialog;
