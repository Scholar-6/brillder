import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

interface Props {
  currentChoice: number;
  minChoice: number;
  maxChoice: number;
  label?: string;
  setChoice(choice: number): void;
}

const CheckBoxM1:React.FC<Props> = (props) => {
  const {currentChoice, label, minChoice, maxChoice} = props;

  return (
    <label
      className={`check-box-container container ${currentChoice >= minChoice && currentChoice <= maxChoice ? "bold" : ""}`}
      onClick={() => props.setChoice(currentChoice)}
    >
      {label}
      <SpriteIcon name={currentChoice >= minChoice && currentChoice <= maxChoice ? 'radio-btn-active' : 'radio-btn-blue'} />
    </label>
  );
}

export default CheckBoxM1;
