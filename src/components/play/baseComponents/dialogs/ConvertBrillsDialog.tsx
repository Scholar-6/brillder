import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { connect } from 'react-redux';

import './PremiumLearnerDialog.scss';
import userActions from 'redux/actions/user';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { User } from "model/user";
import { convertBrillsToCredits } from "services/axios/brills";
import BrillIcon from "components/baseComponents/BrillIcon";

interface InvitationProps {
  isOpen: boolean;
  submit(): void;
  competitionId: number | null;
  user: User;
  close(): void;
  getUser(): void;
}

const BuyCreditsDialog: React.FC<InvitationProps> = ({ user, competitionId, ...props}) => {
  const [clicked, setClicked] = React.useState(false);

  const convert = async () => {
    if (clicked) {
      return;
    }
    setClicked(true);
    const success = await convertBrillsToCredits(competitionId);
    if (success) {
      props.getUser();
      props.close();
      props.submit();
    }
    setClicked(false);
  }
  

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.close}
      className="dialog-box premium-educator-dialog bold out-of-credits-dialog"
    >
      <div className="close-button svgOnHover" onClick={props.close}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="flex-center top-popup-brill-icon">
        <BrillIcon />
      </div>
      <div className="premium-label smaller">
        {competitionId ? <div>To enter this competition, you will need<br/> to convert 200 brills into 2 credits.</div> : <div>To play this brick, you will need<br/> to convert 100 brills into 1 credit.</div>}
      </div>
      <div className="green-btn" onClick={convert}>
        Convert and Start Playing
      </div>
    </Dialog>
  );
};


const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(userActions.getUser()),
});

export default connect(null, mapDispatch)(BuyCreditsDialog);
