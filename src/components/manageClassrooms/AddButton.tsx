import './AddButton.scss';
import React from 'react';

interface AddButtonProps {
  label: string;
  history: any;
  link: string;
}

const AddButton: React.FC<AddButtonProps> = props => {
  const moveToNewUser = () => props.history.push(props.link);

  return (
    <div className="create-user-button" onClick={moveToNewUser} >
      <img alt="" src="/feathericons/svg/user-plus-blue.svg" />
      <span>{props.label}</span>
    </div>
  );
}

export default AddButton;
