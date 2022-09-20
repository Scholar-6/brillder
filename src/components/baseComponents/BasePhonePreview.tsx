import React from "react";

interface Props {
  children: any;
}


const BasePhonePreview: React.FC<Props> = (props) => {
  return (
    <div className="phone">
      <div className="phone-border">
        <div className="volume volume1"></div>
        <div className="volume volume2"></div>
        <div className="volume volume3"></div>
        <div className="sleep"></div>
        <div className="screen">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default BasePhonePreview;
