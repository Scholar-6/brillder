import React from 'react';


interface CorrectTickProps {
  customClass?: string;
}

const CorrectTick: React.FC<CorrectTickProps> = ({customClass = ""}) => {
  return <span className={customClass + " tick-icon tick-notFilledGreenCircleTick"}></span>;
}

export default CorrectTick;
