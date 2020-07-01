import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

import "./FailedRequestDialog.scss";


interface ShuffleAnswerDialogProps {
  isOpen: boolean;
  submit(): void;
  close(): void;
}

class ShuffleAnswerDialog extends Component<ShuffleAnswerDialogProps> {
  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.props.close()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="delete-brick-dialog"
      >
        <div className="dialog-header">
          <div>Is this your answer?</div>
        </div>
        <Grid container direction="row" className="row-buttons" justify="center">
          <Button className="yes-button" onClick={() => this.props.submit()}>
            Yes
          </Button>
          <Button className="no-button" onClick={() => this.props.close()}>
            No, skip
          </Button>
        </Grid>
      </Dialog>
    );
  }
}

export default ShuffleAnswerDialog;
