import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";

import './SaveDialog.scss';

interface SkipTutorialDialogProps {
  open: boolean;
  save(): void;
  close(): void;
}

const SaveDialog: React.FC<SkipTutorialDialogProps> = ({
  open, save, close
}) => {
  return (
    <BaseDialogWrapper open={open} className="save-brick-dialog" close={close} submit={save}>
      <div className="dialog-header bold">
        <div>Stop building for now?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange bold yes-button" onClick={save}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray bold no-button" onClick={close}>
          <span>No</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default SaveDialog;
