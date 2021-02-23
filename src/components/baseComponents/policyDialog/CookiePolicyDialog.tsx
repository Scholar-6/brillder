import React from 'react';
import Dialog from "@material-ui/core/Dialog";

import './PolicyDialog.scss';

interface PolicyDialogProps {
  isOpen: boolean;
  close(): void;
}

const CookiePolicyDialog: React.FC<PolicyDialogProps> = (props) => {
  return (
    <Dialog open={props.isOpen} className="dialog-box privacy-policy-dialog cookie-policy-dialog">
      <div className="private-policy-content">
        <h1 className="private-policy-title">We track users using Cookies</h1>
        <p>
          If we had a market stall we would ask you where you are from and where you are going? We don't have a market stall so we are asking if we can put some cookies in your browser that track how you found us and if you decide to come back. If you accept and then change your mind you can push the button in the bottom right to 'stop tracking', and if you want all records of your visit to be deleted you can send us a message using the help button in the bottom left.
        </p>
      </div>
      <button className="btn btn-md bg-theme-orange yes-button" onClick={props.close}>
        <span>Accept Cookies</span>
      </button>
    </Dialog>
  );
}

export default CookiePolicyDialog;
