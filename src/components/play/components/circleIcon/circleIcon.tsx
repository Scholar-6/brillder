import React from 'react';

import './circleIcon.scss';

interface CircleIconNumberProps {
  number: number,
  customClass?: string,
}

const CircleIconNumber: React.FC<CircleIconNumberProps> = ({ number, customClass = "" }) => {
  return (
    <span className={customClass + " icon-circle-blue icon-circle-blue-" + number}>
      <span className="path1"></span><span className="path2"></span>
      <span className="path3"></span><span className="path4"></span>
      <span className="path5"></span><span className="path6"></span>
    </span>
  );
}


export default CircleIconNumber