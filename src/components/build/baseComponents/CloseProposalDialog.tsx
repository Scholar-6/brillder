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
        className="delete-brick-dialog"
      >
        <div className="dialog-header">
          <div>Your changes will not be saved.</div>
          <div>Exit anyway?</div>
        </div>
        <Grid container direction="row" className="row-buttons" justify="center">
          <Button className="yes-button" onClick={() => this.props.move()}>
            Yes
          </Button>
          <Button className="no-button" onClick={() => this.props.close()}>
            No
          </Button>
        </Grid>
      </Dialog>
    );
  }
}

export default CloseProposalDialog;
