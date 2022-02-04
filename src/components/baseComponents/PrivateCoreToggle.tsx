import React from "react";
import { isPhone } from "services/phone";

import './PrivateCoreToggle.scss';
import SpriteIcon from "./SpriteIcon";

interface ToggleProps {
  isViewAll?: boolean;
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

  const phone = isPhone();

  return (
    <div className={`private-core-toggle ${props.isViewAll ? 'view-all-toggle' : ''}`}>
      <button className="btn btn-transparent " onClick={props.onSwitch}>
        <span className={isCore ? 'bold' : 'regular'}>{!phone && 'Public'}</span>
        <div className="svgOnHover">
          {renderCoreIcon()}
          {renderPrivateIcon()}
        </div>
        <span className={!isCore ? 'bold' : 'regular'}>{!phone && 'Personal'}</span>
      </button>
    </div>
  );
};

export default PrivateCoreToggle;
