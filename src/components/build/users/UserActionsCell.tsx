import React from 'react';

import axios from 'axios';
import Dialog from "@material-ui/core/Dialog";

import sprite from "../../../assets/img/icons-sprite.svg";

interface UserActionsCellProps {
  isAdmin: boolean;
  history: any;
  userId: number;
  onDelete(userId: number): void;
}

const UserActionsCell: React.FC<UserActionsCellProps> = (
  { history, isAdmin, userId, onDelete }
) => {
  const [isDialogOpen, setDialog] = React.useState(false);

  const closeDeleteDialog = () => setDialog(false);
  const openDeleteDialog = () => setDialog(true);

  const deleteUser = () => {
    axios.delete(
      process.env.REACT_APP_BACKEND_HOST + '/user/delete/' + userId, { withCredentials: true }
    ).then(res => {
      if (res.data === "OK") {
        closeDeleteDialog();
        onDelete(userId);
        return;
      }
      closeDeleteDialog();
      alert('Can`t delete user');
    }).catch(error => {
      closeDeleteDialog();
      alert('Can`t delete user');
    });
  }

  return (
    <td className="user-actions-cell">
      {
        isAdmin
          ? <div className="delete-button svgOnHover" onClick={openDeleteDialog}>
            <svg className="svg w100 h100 active">
              <use href={sprite + "#trash-outline"} className="text-theme-dark-blue" />
            </svg>
          </div>
          : ""
      }
      {
        isAdmin
          ? <div className="edit-button" onClick={() => history.push(`/user-profile/${userId}`)}>
            <svg className="svg w100 h100 active">
              <use href={sprite + "#edit-outline"} className="text-theme-dark-blue" />
            </svg>
          </div>
          : ""
      }
      <Dialog
        open={isDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog-box">
        <div className="dialog-header">
          <div>Permanently delete<br />this user?</div>
        </div>
        <div className="dialog-footer">
          <button className="btn btn-md bg-theme-orange yes-button"
            onClick={deleteUser}>
            <span>Yes, delete</span>
          </button>
          <button className="btn btn-md bg-gray no-button"
            onClick={closeDeleteDialog}>
            <span>No, keep</span>
          </button>
        </div>
      </Dialog>
    </td>
  );
}

export default UserActionsCell;
