import React from 'react'

interface CircleIconNumberProps {
  number: number,
  customClass: string
}

const CircleIconNumber: React.FC<CircleIconNumberProps> = ({ number, customClass }: any) => {
  return (
    <span className={customClass + " icon-filled-circle-blue-" + number}>
      <span className="path1"></span><span className="path2"></span>
      <span className="path3"></span><span className="path4"></span>
      <span className="path5"></span><span className="path6"></span>
    </span>
  );
}

export default CircleIconNumber