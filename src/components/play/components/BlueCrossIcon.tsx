import React from 'react';


interface BlueCrossProps {
  customClass?: string;
}

const BlueCrossIcon: React.FC<BlueCrossProps> = ({customClass = ""}) => {
  return <span className={customClass + " tick-icon tick-NotFilledBlueCircleCross"}></span>;
}

export default BlueCrossIcon;
