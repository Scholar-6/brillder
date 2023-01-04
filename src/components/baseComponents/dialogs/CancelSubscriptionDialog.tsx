import React from "react";
import Dialog from "@material-ui/core/Dialog";

interface DialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

const CancelSubscriptionDialog: React.FC<DialogProps> = ({ isOpen, submit, close }) => {
  return (
    <Dialog open={isOpen} onClose={close} className="dialog-box light-blue">
      <div className="dialog-header">
        <div className="bold" style={{textAlign: 'center'}}>Cancel Subscription?</div>
        <div>Cancelling will remove your payment method and set your subscription to not renew at the end of your billing period. You will continue to have access to the service until this time. See Terms & Conditions for more information.</div>
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
