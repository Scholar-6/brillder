import React, { Component } from "react";
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
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button"
            onClick={() => this.props.submit()}>
            <span>Yes</span>
          </button>
          <button className="btn btn-md bg-gray no-button"
            onClick={() => this.props.close()}>
            <span>No, skip</span>
          </button>
        </div>
      </Dialog>
    );
  }
}

export default ShuffleAnswerDialog;
