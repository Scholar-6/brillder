import React from 'react';

interface Props {
  currentChoice: number;
  choice: number | null;
  label?: string;
  setChoice(choice: number): void;
}

const CheckBoxPhone:React.FC<Props> = (props) => {
  const {currentChoice, label, choice} = props;

  return (
    <label
      className={`check-box-container checkbox-rd1 container ${currentChoice === choice ? "active" : ""}`}
      onClick={() => props.setChoice(currentChoice)}
    >
      {label}
    </label>
  );
}


export default CheckBoxPhone;
