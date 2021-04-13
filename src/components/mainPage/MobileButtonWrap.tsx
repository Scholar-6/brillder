import React from "react";

interface ButtonProps {}

const MobileButtonWrap: React.FC<ButtonProps> = props => {
  return (
    <div style={{zIndex: 99999}}>
      {props.children}
    </div>
  )
}

export default MobileButtonWrap;
