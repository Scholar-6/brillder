import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { connect } from 'react-redux';

import './PremiumLearnerDialog.scss';
import userActions from 'redux/actions/user';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User } from "model/user";
import { convertBrillsToCredits } from "services/axios/brills";
import { StripeCredits } from "components/map";

interface InvitationProps {
  isOpen: boolean;
  submit(): void;
  competitionId: number | null;
  history: any;
  user: User;
  close(): void;
  getUser(): void;
}

const PremiumLearnerDialog: React.FC<InvitationProps> = ({ user, ...props}) => {
  let haveBrills = false;

  const [clicked, setClicked] = React.useState(false);

  if (user.brills) {
    if (props.competitionId && user.brills >= 200) {
      haveBrills = true;
    } else if (!props.competitionId && user.brills >= 100) {
      haveBrills = true;
    }
  }

  const convert = async () => {
    if (clicked) {
      return;
    }
    setClicked(true);
    const success = await convertBrillsToCredits(props.competitionId);
    if (success) {
      props.getUser();
      props.close();
      // get user
      // animate brills
    }
    setClicked(false);
  }
  

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box premium-educator-dialog bold"
    >
      <div className="flex-center premium-label">
        You are out of credits. <SpriteIcon className="text-orange" name="alert-triangle" />
      </div>
      <div className="flex-center">
        {haveBrills &&
        <div className="green-btn" onClick={() => convert()}>
          Convert brills to credits
        </div>}
        <div className="green-btn" onClick={() => props.history.push(StripeCredits)}>
          Buy more credits
        </div>
      </div>
    </Dialog>
  );
};


const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(null, mapDispatch)(PremiumLearnerDialog);
