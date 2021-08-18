import './AddUserButton.scss';
import React from 'react';
import map from 'components/map';

interface AddUserButtonProps {
  history: any;
}

const AddUserButton: React.FC<AddUserButtonProps> = ({history}) => {
  const moveToNewUser = () => {
    history.push(map.UserProfile + '/new');
  }

  return (
    <div className="add-user-button" onClick={moveToNewUser} >
      <img alt="" src="/feathericons/svg/user-plus-blue.svg" />
      <span>Add User</span>
    </div>
  );
}

export default AddUserButton;
