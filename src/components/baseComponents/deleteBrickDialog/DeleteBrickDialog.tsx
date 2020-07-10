import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import axios from 'axios';
import Dialog from "@material-ui/core/Dialog";

import "./DeleteBrickDialog.scss";


interface DeleteDialogProps {
  isOpen: boolean;
  brickId: number;
  close(): void;
  onDelete(brickId: number): void;
}

class DeleteBrickDialog extends Component<DeleteDialogProps> {
  handleDeleteClose = () => this.props.close();

  delete() {
    const {brickId} = this.props;
    axios.delete(
      process.env.REACT_APP_BACKEND_HOST + '/brick/' + brickId, {withCredentials: true}
    ).then(res => {
      this.props.onDelete(brickId);
    }).catch(error => {
      alert('Can`t delete bricks');
    });
  }

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.handleDeleteClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-box">
        <div className="dialog-header">
          <div>Permanently delete</div>
          <div>this brick?</div>
        </div>
        <Grid container direction="row" className="dialog-footer" justify="center">
          <Button className="yes-button" onClick={() => this.delete()}>
            Yes, delete
          </Button>
          <Button
            className="no-button"
            onClick={() => this.handleDeleteClose()}>
            No, keep
          </Button>
        </Grid>
      </Dialog>
    );
  }
}

export default DeleteBrickDialog;
