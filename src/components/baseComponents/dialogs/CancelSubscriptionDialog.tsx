import React from "react";
import Dialog from "@material-ui/core/Dialog";
import map from "components/map";
import SpriteIcon from "../SpriteIcon";

interface DialogProps {
  isOpen: boolean;
  history: any;
  submit(): void;
  close(): void;
}

const CancelSubscriptionDialog: React.FC<DialogProps> = ({ isOpen, history, submit, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box light-blue cancel-subscription-dialog">
      <div className="close-button svgOnHover" onClick={close}>
        <SpriteIcon name="cancel" className="w100 h100 active" />
      </div>
      <div className="dialog-header">
        <div className="bold" style={{textAlign: 'center'}}>Cancel Subscription?</div>
        <div className="light">
          Cancelling will remove your payment method and set your subscription to not renew at the end of your billing period. You will continue to have access to the service until this time. See <span className="sub-terms-link" onClick={() => history.push(map.SubscriptionTerms)}>Terms & Conditions</span> for more information.
        </div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={submit}>
          <span>Yes, Cancel Subscription</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={close}>
          <span>Keep Subscription</span>
        </button>
      </div>
    </Dialog>
  );
};

export default CancelSubscriptionDialog;
