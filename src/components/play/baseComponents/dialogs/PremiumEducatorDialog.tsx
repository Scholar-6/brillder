import React from "react";
import Dialog from "@material-ui/core/Dialog";

import './PremiumEducatorDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface InvitationProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const PremiumEducatorDialog: React.FC<InvitationProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box premium-educator-dialog bold"
    >
      <div className="flex-center premium-label">
        Go Premium <SpriteIcon name="hero-sparkle" />
        <div className="absolute-label">
          Educators
        </div>
      </div>
      <div className="list">
        <div>
          <SpriteIcon name="check-icon" className="text-green" />
          Unlimited Assignments
        </div>
        <div>
          <SpriteIcon name="check-icon" className="text-green" />
          Request Bespoke Content
        </div>
        <div>
          <SpriteIcon name="check-icon" className="text-green" />
          Adapt Existing Bricks
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

export default PremiumEducatorDialog;
