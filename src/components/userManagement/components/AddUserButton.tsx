import './AddUserButton.scss';
import React from 'react';

interface AddUserButtonProps {
  history: any;
}

const AddUserButton: React.FC<AddUserButtonProps> = ({history}) => {
  const moveToNewUser = () => {
    history.push('/user-profile/new');
  }

  return (
    <div className="add-user-button" onClick={moveToNewUser} >
      <img alt="" src="/feathericons/svg/user-plus-blue.svg" />
      <span>ADD USER</span>
    </div>
  );
}

export default AddUserButton;
