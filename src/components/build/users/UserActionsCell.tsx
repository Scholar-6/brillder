import React from 'react';

import { Grid, Button } from "@material-ui/core";
import axios from 'axios';
import Dialog from "@material-ui/core/Dialog";


interface UserActionsCellProps {
  history: any;
  userId: number;
}

const UserActionsCell: React.FC<UserActionsCellProps> = ({history, userId}) => {
  const [isDialogOpen, setDialog] = React.useState(false);

  const closeDeleteDialog = () => setDialog(false);
  const openDeleteDialog = () => setDialog(true);

  const deleteUser = () => {
    closeDeleteDialog();
  }

  return (
    <td className="user-actions-cell">
      <div className="delete-button" onClick={openDeleteDialog}/>
      <div className="edit-button" onClick={() => history.push(`/user-profile/${userId}`)}/>
      <Dialog
        open={isDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="delete-brick-dialog"
      >
        <div className="dialog-header">
          <div>Permanently delete</div>
          <div>this user?</div>
        </div>
        <Grid container direction="row" className="row-buttons" justify="center">
          <Button className="yes-button" onClick={deleteUser}>
            Yes, delete
          </Button>
          <Button
            className="no-button"
            onClick={closeDeleteDialog}
          >
            No, keep
          </Button>
        </Grid>
      </Dialog>
    </td>
  );
}

export default UserActionsCell;
