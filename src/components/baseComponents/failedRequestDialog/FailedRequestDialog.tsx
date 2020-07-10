import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";

import "./FailedRequestDialog.scss";


interface DeleteDialogProps {
  isOpen: boolean;
  close(): void;
}

class FailedRequestDialog extends Component<DeleteDialogProps> {
  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.props.close()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-box">
        <div className="dialog-header">
          <div>Sorry, we've run into a brick wall. Click refresh and see if we can get over it.</div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button"
            onClick={() => this.props.close()}>
            <span>Close</span>
          </button>
        </div>
      </Dialog>
    );
  }
}

export default FailedRequestDialog;
