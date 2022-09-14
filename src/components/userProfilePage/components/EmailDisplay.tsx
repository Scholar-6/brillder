import React from 'react';

interface InputProps {
  value: string;
  onClick(): void;
}

const ProfileInput: React.FC<InputProps> = props => {
  const {value} = props;

  const emailParts = value.split('@');
  const hiddenEmail = emailParts[0][0] + '•••••••@' + emailParts[1][0] + '••••••••';
  
  return (
    <div className="input-block">
      <div className="email-value">{hiddenEmail}</div>
    </div>
  );
}

export default ProfileInput;