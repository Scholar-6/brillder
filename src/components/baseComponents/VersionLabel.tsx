import React from "react";


const VersionLabel:React.FC = () => {
  return (
    <div className="beta-text">
      <div>BETA</div>
      <div className="version-number">{process.env.REACT_APP_VERSION ? process.env.REACT_APP_VERSION : ""}</div>
    </div>
  );
}

export default VersionLabel;
