import React from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import map from 'components/map';

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
        <div className="edit-button" onClick={() => props.history.push(map.UserProfile + `/${props.userId}`)}>
          <SpriteIcon name="edit-outline" className="w100 h100 active text-theme-dark-blue" />
        </div>
        <div className="delete-button svgOnHover" onClick={() => props.onDelete(props.userId)}>
          <SpriteIcon name="trash-outline" className="w100 h100 active text-theme-dark-blue" />
        </div>
      </div>
    </td>
  );
}

export default UserActionsCell;
