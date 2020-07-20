import React, { Component } from "react";
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
          <div>Permanently delete<br/>this brick?</div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button"
            onClick={() => this.delete()}>
            <span>Yes, delete</span>
          </button>
          <button className="btn btn-md bg-gray no-button"
            onClick={() => this.handleDeleteClose()}>
            <span>No, keep</span>
          </button>
        </div>
      </Dialog>
    );
  }
}

export default DeleteBrickDialog;
