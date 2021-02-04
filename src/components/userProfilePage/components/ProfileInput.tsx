import React from 'react';

interface InputProps {
  className: string;
  value: string;
  placeholder: string;
  validationRequired: boolean;
  shouldBeFilled?: boolean;
  type?: string;
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
}

const ProfileInput: React.FC<InputProps> = props => {
  let {shouldBeFilled} = props;
  if (shouldBeFilled !== false) {
    shouldBeFilled = true;
  }
  
  const {value} = props;
  let className = props.className + ' style2';
  
  if (props.validationRequired && !value && shouldBeFilled) {
    className += ' invalid';
  }
 
  return (
    <div className="input-block">
      <input type={props.type} className={className} value={value} onChange={e => props.onChange && props.onChange(e)} placeholder={props.placeholder} />
    </div>
  );
}

export default ProfileInput;