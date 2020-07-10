import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";


interface CloseProposalDialogProps {
  isOpen: boolean;
  close(): void;
  move(): void;
}

class CloseProposalDialog extends Component<CloseProposalDialogProps> {
  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.props.close()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-box">
        <div className="dialog-header">
          <div>Your changes will not be saved.<br />Exit anyway?</div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button"
            onClick={() => this.props.move()}>
            <span>Yes</span>
          </button>
          <button className="btn btn-md bg-gray no-button"
            onClick={() => this.props.close()}>
            <span>No</span>
          </button>
        </div>
      </Dialog>
    );
  }
}

export default CloseProposalDialog;
