import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

interface Props {
  currentChoice: number;
  choice: number | null;
  label?: string;
  setChoice(choice: number): void;
}

const CheckBoxV2:React.FC<Props> = (props) => {
  const {currentChoice, label, choice} = props;

  return (
    <label className={`check-box-container container ${currentChoice === choice ? "bold" : ""}`} onClick={() => props.setChoice(currentChoice)}>
      {label}
      <SpriteIcon name={currentChoice === choice ? 'radio-btn-active' : 'radio-btn-blue'} />
    </label>
  );
}


export default CheckBoxV2;
