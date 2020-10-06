import React from "react";

import './PrivateCoreToggle.scss';
import SpriteIcon from "./SpriteIcon";

interface ToggleProps {
  notVisible?: boolean;
  isCore: boolean;
  onSwitch(): void;
}

const PrivateCoreToggle: React.FC<ToggleProps> = props => {
  const {isCore} = props;

  const renderCoreIcon = () => {
    let className = "svg active";
    if (isCore) {
      className += " selected";
    }
    return <SpriteIcon name="globe" className={className} />;
  }

  const renderPrivateIcon = () => {
    let className = "svg active";
    if (!isCore) {
      className += " selected";
    }
    return <SpriteIcon name="key" className={className} />;
  }

  if (props.notVisible) {
    return <div></div>;
  }

  return (
    <div className="private-core-toggle">
      <button className="btn btn btn-transparent ">
        <span className={isCore ? 'bold' : 'regular'}>Public</span>
        <div className="svgOnHover" onClick={props.onSwitch}>
          {renderCoreIcon()}
          {renderPrivateIcon()}
        </div>
        <span className={!isCore ? 'bold' : 'regular'}>Personal</span>
      </button>
    </div>
  );
};

export default PrivateCoreToggle;
