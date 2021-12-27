import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";

import './SaveDialog.scss';

interface SkipTutorialDialogProps {
  open: boolean;
  close(): void;
}

const SaveFailedDialog: React.FC<SkipTutorialDialogProps> = ({
  open, close
}) => {
  return (
    <BaseDialogWrapper open={open} className="save-brick-dialog" close={close} submit={close}>
      <div className="dialog-header bold">
        <div>You appear to be disconnected from the internet, changes may be lost. Please reconnect before continuing.</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange bold yes-button" onClick={close}>
          <span>Continue</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default SaveFailedDialog;
