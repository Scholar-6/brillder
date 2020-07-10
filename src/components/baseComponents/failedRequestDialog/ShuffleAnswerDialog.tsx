import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

import "./FailedRequestDialog.scss";


interface ShuffleAnswerDialogProps {
  isOpen: boolean;
  hide(): void;
  submit(): void;
  close(): void;
}

class ShuffleAnswerDialog extends Component<ShuffleAnswerDialogProps> {
  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.props.hide()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-box">
        <div className="dialog-header">
          <div>Is this your answer?</div>
        </div>
        <Grid container direction="row" className="dialog-footer" justify="center">
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
