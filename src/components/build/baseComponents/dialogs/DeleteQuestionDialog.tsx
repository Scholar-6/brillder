import React from "react";
import BaseDialogWrapper from "components/baseComponents/dialogs/BaseDialogWrapper";


interface DeleteQuestionDialogProps {
  open: boolean;
  index: number;
  setDialog(open: boolean): void;
  deleteQuestion(index: number): void;
}

const DeleteQuestionDialog: React.FC<DeleteQuestionDialogProps> = ({
  open, index, setDialog, deleteQuestion
}) => {
  return (
    <BaseDialogWrapper open={open} close={() => setDialog(false)} submit={() => deleteQuestion(index)}>
      <div className="dialog-header">
        <div>Permanently delete<br />this question?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={() => deleteQuestion(index)}>
          <span>Yes, delete</span>
        </button>
        <button className="btn btn-md bg-gray no-button"
          onClick={() => setDialog(false)}>
          <span>No, keep</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

export default DeleteQuestionDialog;
