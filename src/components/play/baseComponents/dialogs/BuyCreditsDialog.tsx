import React from "react";
import Dialog from "@material-ui/core/Dialog";

import './PremiumLearnerDialog.scss';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User } from "model/user";
import { StripeCredits } from "components/map";
import BrillIcon from "components/baseComponents/BrillIcon";

interface InvitationProps {
  isOpen: boolean;
  competitionId: number | null;
  history: any;
  user: User;
  convert(): void;
  close(): void;
}

const BuyCreditsDialog: React.FC<InvitationProps> = ({ user, ...props}) => {
  let haveBrills = false;

  if (user.brills) {
    if (props.competitionId && user.brills >= 200) {
      haveBrills = true;
    } else if (!props.competitionId && user.brills >= 100) {
      haveBrills = true;
    }
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box premium-educator-dialog bold out-of-credits-dialog"
    >
      <div className="flex-center">
        <div className="red-circle"><SpriteIcon name="alert-triangle" /></div>
      </div>
      <div className="flex-center premium-label">
        Oh no! You are out of credits.
      </div>
      <div className="flex-center mobile-block">
        {haveBrills &&
        <div className="grey-btn" onClick={() => props.convert()}>
          <BrillIcon />
          Convert brills to credits
        </div>}
        <div className="green-btn" onClick={() => props.history.push(StripeCredits)}>
          Buy more credits
        </div>
      </div>
    </Dialog>
  );
};

export default BuyCreditsDialog;
