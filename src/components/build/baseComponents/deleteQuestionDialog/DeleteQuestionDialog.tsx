import React from "react";
import { Grid, Button } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';


interface DeleteQuestionDialogProps {
  open: boolean;
  index: number;
  setDialog(open: boolean): void;
  deleteQuestion(index: number): void;
}

const DeleteQuestionDialog:React.FC<DeleteQuestionDialogProps> = ({
  open, index, setDialog, deleteQuestion
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => setDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="delete-brick-dialog"
    >
      <div className="dialog-header">
        <div>Permanently delete</div>
        <div>this question?</div>
      </div>
      <Grid container direction="row" className="row-buttons" justify="center">
        <Button className="yes-button" onClick={() => deleteQuestion(index)}>Yes, delete</Button>
        <Button className="no-button" onClick={() => setDialog(false)}>No, keep</Button>
      </Grid>
    </Dialog>
  );
}

export default DeleteQuestionDialog;
