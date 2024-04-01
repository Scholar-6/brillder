import React from 'react';

interface Props {
  currentChoice: number;
  choice: number | null;
  label?: string;
  setChoice(choice: number): void;
}

const ButonR34:React.FC<Props> = (props) => {
  const {currentChoice, label, choice} = props;

  return (
    <div className={`button-r34 ${currentChoice === choice ? "active bold" : "not-active"}`} onClick={() => props.setChoice(currentChoice)}>
      {label}
    </div>
  );
}


export default ButonR34;
