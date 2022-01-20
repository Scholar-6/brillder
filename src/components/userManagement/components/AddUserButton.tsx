import './AddUserButton.scss';
import React from 'react';
import map from 'components/map';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface AddUserButtonProps {
  history: any;
}

const AddUserButton: React.FC<AddUserButtonProps> = ({history}) => {
  const moveToNewUser = () => {
    history.push(map.UserProfile + '/new');
  }

  return (
    <div className="add-user-button" onClick={moveToNewUser} >
      <SpriteIcon name="user-plus" />
      <span>Add User</span>
    </div>
  );
}

export default AddUserButton;
