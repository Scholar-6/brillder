import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

interface Props {
  currentChoice: string;
  correctChoice: string;
  label?: string;
  setChoice(choice: string): void;
}

const CheckBoxM1:React.FC<Props> = (props) => {
  const {currentChoice, label, correctChoice } = props;

  return (
    <label
      className={`check-box-container container ${currentChoice == correctChoice ? "bold" : ""}`}
      onClick={() => props.setChoice(currentChoice)}
    >
      {label}
      <SpriteIcon name={currentChoice == correctChoice ? 'radio-btn-active' : 'radio-btn-blue'} />
    </label>
  );
}

export default CheckBoxM1;
