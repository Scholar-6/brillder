import React from 'react';

interface Props {
  currentChoice: number;
  choice: number | null;
  label?: string;
  className?: string;
  setChoice(choice: number): void;
}

const ButonR34:React.FC<Props> = (props) => {
  const {currentChoice, label, choice} = props;

  return (
    <div
      className={`button-r34 ${currentChoice === choice ? "active bold" : "not-active"} ${props.className}`}
      onClick={() => props.setChoice(currentChoice)}
      dangerouslySetInnerHTML={{__html: label ? label : ''}}
    />
  );
}


export default ButonR34;
