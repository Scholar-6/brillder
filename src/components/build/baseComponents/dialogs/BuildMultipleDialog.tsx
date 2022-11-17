import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";

import './BuildMultipleDialog.scss';

interface SkipTutorialDialogProps {
  open: boolean;
  goHome(): void;
  close(): void;
}

const BuildMultipleDialog: React.FC<SkipTutorialDialogProps> = ({
  open, close, goHome
}) => {
  return (
    <BaseDialogWrapper open={open} className="build-multiple-dialog" close={close} submit={close}>
      <div className="dialog-header bold">
        <div className="flex-center bigger-text">
          This brick is currently being worked on in another location. 
        </div>
        <div>
          To ensure compatibility, please close this tab and return to the earlier-opened version
        </div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange bold yes-button" onClick={close}>
          <span>Continue anyway</span>
        </button>
        <button className="btn btn-md bg-theme-dark-blue yes-button" onClick={goHome}>
          <span>Return to home</span>
        </button>
      </div>
    </BaseDialogWrapper >
  );
}

export default BuildMultipleDialog;
