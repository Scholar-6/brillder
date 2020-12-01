import './AddButton.scss';
import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface AddButtonProps {
  isAdmin: boolean;
  onOpen(): void;
}

const AddStudentButton: React.FC<AddButtonProps> = props => {
  return (
    <div className="create-user-button-wrap">
      <div className="create-user-button" onClick={props.onOpen}>
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
