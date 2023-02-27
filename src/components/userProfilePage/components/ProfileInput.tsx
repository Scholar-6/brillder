import React from 'react';

interface InputProps {
  className: string;
  value: string;
  placeholder: string;
  validationRequired: boolean;
  shouldBeFilled?: boolean;
  type?: string;
  disabled?: boolean;
  autoCompleteOff?: boolean;
  onChange?(event: React.ChangeEvent<HTMLInputElement>): void;
  onInput?(event: any): void;
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

  if (props.autoCompleteOff) {
    return (
      <form autoComplete="off" className="input-block">
        <input
          autoComplete='none' type={props.type} disabled={props.disabled} className={className} value={value}
          onChange={e => props.onChange && props.onChange(e)}
          onInput={(e:any) => props.onInput && props.onInput(e)}
          placeholder={props.placeholder}
        />
      </form>
    );
  }

  return (
    <div className="input-block">
      <input
        type={props.type} disabled={props.disabled} className={className} value={value}
        onChange={e => props.onChange && props.onChange(e)}
        onInput={(e:any) => props.onInput && props.onInput(e)}
        placeholder={props.placeholder} />
    </div>
  );
}

export default ProfileInput;