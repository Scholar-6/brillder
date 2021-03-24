import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";


interface DeleteQuestionDialogProps {
  isOpen: boolean;
  index?: number;
  title: string;
  close(value: boolean): void;
  submit(index?: number): void;
}

const DeleteDialog: React.FC<DeleteQuestionDialogProps> = ({
  isOpen, index, title, close, submit
}) => {
  const onSubmit = () => submit(index);
  const onClose = () => close(false);

  return (
    <BaseDialogWrapper open={isOpen} close={onClose} submit={onSubmit}>
      <div className="dialog-header">
        <div dangerouslySetInnerHTML={{__html: title}}></div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={onSubmit}>
          <span>Yes, delete</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={onClose}>
          <span>No, keep</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default DeleteDialog;
