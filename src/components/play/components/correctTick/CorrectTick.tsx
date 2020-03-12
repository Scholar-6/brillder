import React from 'react';

import './circleIcon.scss';

interface CorrectTickProps {
  customClass?: string,
}

const CorrectTick: React.FC<CorrectTickProps> = ({ customClass = "" }) => {
  return <span className={customClass + " icon-circle-blue icon-circle-blue"}></span>;
}

export default CorrectTick;
