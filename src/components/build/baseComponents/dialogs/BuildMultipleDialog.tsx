import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";

import './BuildMultipleDialog.scss';

interface SkipTutorialDialogProps {
  open: boolean;
  close(): void;
}

const BuildMultipleDialog: React.FC<SkipTutorialDialogProps> = ({
  open, close
}) => {
  return (
    <BaseDialogWrapper open={open} className="build-multiple-dialog" close={close} submit={close}>
      <div className="dialog-header bold">
        <div className="flex-center bigger-text">
          This brick is currently being worked on in another location.
        </div>
        <div>
          To ensure compatibility, please close this tab
        </div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange bold yes-button" onClick={close}>
          <span>Continue</span>
        </button>
      </div>
    </BaseDialogWrapper >
  );
}

export default BuildMultipleDialog;
