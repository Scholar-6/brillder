import './AddButton.scss';
import React from 'react';

interface AddButtonProps {
  history: any;
  isAdmin: boolean;
}

const AddStudentButton: React.FC<AddButtonProps> = props => {
  const moveToNewUser = () => {
    if (props.isAdmin) {
      props.history.push('/user-profile/new');
    } else {
      alert('you don`t have permisions to create new user');
    }
  }

  return (
    <div className="create-user-button" onClick={moveToNewUser} >
      <img alt="" src="/feathericons/svg/user-plus-blue.svg" />
      <span>ADD NEW STUDENT</span>
    </div>
  );
}

export default AddStudentButton;
