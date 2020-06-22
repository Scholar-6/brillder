import React from "react";
import { Grid, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

interface SubjectDialogProps {
  isOpen: boolean;
  close(): void;
}

const SubjectDialog: React.FC<SubjectDialogProps> = ({ isOpen, close }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => close()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="delete-brick-dialog"
    >
      <div className="dialog-header">
        <div>You need to assign at least one subject to user</div>
      </div>
      <Grid container direction="row" className="row-buttons" justify="center">
        <Button
          className="yes-button"
          onClick={() => close()}
        >
          Close
        </Button>
      </Grid>
    </Dialog>
  );
};

export default SubjectDialog;
