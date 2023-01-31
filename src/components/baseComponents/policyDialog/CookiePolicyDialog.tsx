import React from 'react';
import Dialog from "@material-ui/core/Dialog";

import './PolicyDialog.scss';
import { enableTracking } from 'services/matomo';

interface PolicyDialogProps {
  isReOpened: boolean;
  isOpen: boolean;
  close(): void;
}

const CookiePolicyDialog: React.FC<PolicyDialogProps> = (props) => {
  const accept = () => {
    enableTracking();
    props.close();
  }
  if (!props.isReOpened) {
    return (
      <Dialog open={props.isOpen} className="dialog-box privacy-policy-dialog cookie-policy-dialog">
      <div className="private-policy-content">
        <h1 className="private-policy-title">Cookies will be enabled</h1>
        <p>
          Brillder uses cookies only to facilitate your user experience, primarily to keep track of your account settings and progress, and to help us understand how people use brillder.com. Please click Keep Exploring to consent to storing cookies from Brillder. If you change your mind in the future, you can remove cookies using the options menu at the bottom of the screen, or send us a message us a message at <a href = "mailto: hello@scholar6.org">hello@scholar6.org</a> and we will remove all records of your visit.
        </p>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-green yes-button" onClick={accept}>
          <span>Keep exploring</span>
        </button>
      </div>
      </Dialog>
    );
  } else {
    return (
      <Dialog open={props.isOpen} className="dialog-box privacy-policy-dialog cookie-policy-dialog">
      <div className="private-policy-content">
        <h1 className="private-policy-title">Cookies Have Been Deleted</h1>
        <p>
          Your activity will no longer be tracked, though if you want to keep exploring you will need to consent to storing cookies again.
        </p>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-green yes-button" onClick={accept}>
          <span>Keep exploring</span>
        </button>
      </div>
      </Dialog>
    );
  }
}

export default CookiePolicyDialog;
