import './AddButton.scss';
import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

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
    <div className="create-user-button-wrap">
      <div className="create-user-button" onClick={moveToNewUser} >
        <div className="circle">
          <SpriteIcon name="user-plus" />
        </div>
        <div className="label">
          <span>Add New Student</span>
        </div>
      </div>
    </div>
  );
}

export default AddStudentButton;
