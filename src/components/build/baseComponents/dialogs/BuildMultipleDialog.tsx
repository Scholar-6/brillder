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
          Warning: either you have another build window open, or this brick is being worked on by another user.
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
