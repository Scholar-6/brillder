import React from "react";
import Dialog from '@material-ui/core/Dialog';


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
    <Dialog
      open={open}
      onClose={() => setDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog-box">
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
    </Dialog>
  );
}

export default DeleteQuestionDialog;
