import React from "react";


const VersionLabel:React.FC = () => {
  return (
    <div className="beta-text">
      BETA {process.env.REACT_APP_VERSION ? process.env.REACT_APP_VERSION : ""}
    </div>
  );
}

export default VersionLabel;
