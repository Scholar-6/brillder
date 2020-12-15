import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface TabProps {
  isTeach: boolean;
  isCore: boolean;
  onCoreSwitch(): void;
}

const TabComponent: React.FC<TabProps> = ({ isCore, onCoreSwitch }) => {
  const publicClass = () => isCore ? 'active' : 'no-active';
  const personalClass = () => !isCore ? 'active' : 'no-active';

  const getPublicTab = () => {
    const className = publicClass();
    return (
      <div key={2} className={className} onClick={onCoreSwitch}>
        <div style={{display: 'flex'}}>
          <span>Public</span>
          <div className="tab-icon-container">
            <SpriteIcon name="globe" className={className} />
          </div>
        </div>
      </div>
    );
  }

  const getPersonalTab = () => {
    const className = personalClass();
    return (
      <div key={3} className={className} onClick={onCoreSwitch}>
        <div style={{display: 'flex'}}>
          <span>Personal</span>
          <div className="tab-icon-container">
            <SpriteIcon name="key" className={className} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-container">
      {getPublicTab()}
      {getPersonalTab()}
    </div>
  )
}


export default TabComponent;