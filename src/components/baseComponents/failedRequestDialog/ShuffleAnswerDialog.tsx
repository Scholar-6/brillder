import React, { useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";

import "./FailedRequestDialog.scss";
import { enterPressed } from "components/services/key";
import BaseDialogWrapper from "../dialogs/BaseDialogWrapper";


interface ShuffleAnswerDialogProps {
  isOpen: boolean;
  hide(): void;
  submit(): void;
  close(): void;
}

const ShuffleAnswerDialog: React.FC<ShuffleAnswerDialogProps> = (props) => {
  useEffect(() => {
    function handleMove(e: any) {
      if (enterPressed(e)) {
        props.submit();
      }
    }

    document.addEventListener("keydown", handleMove, false);
    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
    };
  }, []);

  return (
    <BaseDialogWrapper open={props.isOpen} close={props.hide} submit={props.submit}>
      <div className="dialog-header">
        <div>Is this your answer?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>No, skip</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default ShuffleAnswerDialog;
