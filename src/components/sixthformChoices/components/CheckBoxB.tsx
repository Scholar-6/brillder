import SpriteIcon from 'components/baseComponents/SpriteIcon';
import React from 'react';

interface Props {
  currentChoice: boolean;
  label?: string;
  toggleChoice(): void;
}

const CheckBoxV2:React.FC<Props> = (props) => {
  const {currentChoice, label} = props;

  return (
    <label className={`check-box-container container ${currentChoice === true ? "bold" : ""}`} onClick={() => props.toggleChoice()}>
      <SpriteIcon name={currentChoice === true ? 'radio-btn-active' : 'radio-btn-blue'} />
      {label}
    </label>
  );
}


export default CheckBoxV2;
