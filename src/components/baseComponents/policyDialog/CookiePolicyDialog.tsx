import React from 'react';
import Dialog from "@material-ui/core/Dialog";

import './PolicyDialog.scss';
import { enableTracking } from 'services/matomo';

interface PolicyDialogProps {
  isOpen: boolean;
  close(): void;
}

const CookiePolicyDialog: React.FC<PolicyDialogProps> = (props) => {
  const accept = () => {
    enableTracking();
    props.close();
  }
  return (
    <Dialog open={props.isOpen} className="dialog-box privacy-policy-dialog cookie-policy-dialog">
      <div className="private-policy-content">
        <h1 className="private-policy-title">Cookies are currently enabled</h1>
        <p>
          If we had a market stall we would ask you where you are from and where you are going. We don't have a market stall, so we are asking if we can put some cookies in your browser that track how you found us and if you decide to come back. If you accept, then change your mind, you can push the button in the bottom right to 'stop tracking'. If you want all records of your visit to be deleted, you can send us a message at <a href = "mailto: support@scholar6.org">support@scholar6.org</a>.
        </p>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={accept}>
          <span>Keep exploring</span>
        </button>
        <button className="btn btn-md bg-theme-orange yes-button" onClick={accept}>
          <span>Disable and stop session</span>
        </button>
      </div>
    </Dialog>
  );
}

export default CookiePolicyDialog;
