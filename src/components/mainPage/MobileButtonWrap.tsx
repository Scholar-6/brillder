import React from "react";

interface ButtonProps {
}

const MobileButtonWrap: React.FC<ButtonProps> = props => {
  const onClick = (e: any) => {
    console.log(e);
  }
  return (
    <div onClick={onClick} style={{zIndex: 99999}}>
      {props.children}
    </div>
  )
}

export default MobileButtonWrap;
