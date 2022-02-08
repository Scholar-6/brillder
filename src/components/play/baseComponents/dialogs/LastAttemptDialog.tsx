import React from "react";
import Dialog from "@material-ui/core/Dialog";

import './LastAttemptDialog.scss';
import map from "components/map";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface InvitationProps {
  isOpen: boolean;
  history: any;
  submit(): void;
  close(): void;
}

const LastAttemptDialog: React.FC<InvitationProps> = props => {
  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box last-attempt-dialog bold"
    >
      <div className="dialog-header">
        <div>You’ve played 9 free bricks and have 1 left.</div>
      </div>
      <div className="flex-center">
        <div className="green-btn" onClick={() => props.submit()}>
          <SpriteIcon name="feather-play-circle" />
          Play Now
        </div>
      </div>
      <div className="flex-center">
        <div className="premium-btn" onClick={() => props.history.push(map.ChoosePlan)}>
          Go Premium <SpriteIcon name="hero-sparkle" />
        </div>
      </div>
    </Dialog>
  );
};

export default LastAttemptDialog;
