import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface TabProps {
  draft: number;
  selfPublish: number;

  isTeach: boolean;
  onCoreSwitch(): void;
}

const TabComponent: React.FC<TabProps> = ({ draft, selfPublish, onCoreSwitch }) => {
  const getPublicTab = () => {
    return (
      <div key={2} className="active" onClick={onCoreSwitch}>
        <div style={{display: 'flex'}}>
          <span>Public</span>
          <SpriteIcon name="globe" className="active" />
        </div>
      </div>
    );
  }

  const getPersonalTab = () => {
    return (
      <div key={3} className="no-active" onClick={onCoreSwitch}>
        <div style={{display: 'flex'}}>
          <span>Personal</span>
          <SpriteIcon name="key" className="no-active" />
        </div>
        <div className="round-button-container">
          <div className="round-button draft">{draft}</div>
          <div className="round-button self-publish">{selfPublish}</div>
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