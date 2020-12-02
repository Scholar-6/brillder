import React from "react";
import BaseDialogWrapper from "../dialogs/BaseDialogWrapper";


interface DeleteDialogProps {
  isOpen: boolean;
  label: string;
  submit(): void;
  close(): void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
  return (
    <BaseDialogWrapper open={props.isOpen} close={props.close} submit={props.submit}>
      <div className="dialog-header">
        <div>{props.label}</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={props.submit}>
          <span>Yes</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={props.close}>
          <span>No</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default DeleteDialog;
