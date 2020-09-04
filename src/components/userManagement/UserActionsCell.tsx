import React from 'react';

import sprite from "assets/img/icons-sprite.svg";

interface UserActionsCellProps {
  isAdmin: boolean;
  history: any;
  userId: number;
  onDelete(userId: number): void;
}

const UserActionsCell: React.FC<UserActionsCellProps> = props => {
  if (!props.isAdmin) {
    return <td className="user-actions-cell"></td>;
  }

  return (
    <td className="user-actions-cell">
      <div>
        <div className="delete-button svgOnHover" onClick={() => props.onDelete(props.userId)}>
          <svg className="svg w100 h100 active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#trash-outline"} className="text-theme-dark-blue" />
          </svg>
        </div>
        <div className="edit-button" onClick={() => props.history.push(`/user-profile/${props.userId}`)}>
          <svg className="svg w100 h100 active">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#edit-outline"} className="text-theme-dark-blue" />
          </svg>
        </div>
      </div>
    </td>
  );
}

export default UserActionsCell;
