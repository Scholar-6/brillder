import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface TabProps {
  draft: number;
  build: number;
  review: number;
  publish: number;

  isTeach: boolean;
  onCoreSwitch(): void;
}

const TabComponent: React.FC<TabProps> = ({ draft, build, review, publish, onCoreSwitch }) => {
  const getPublicTab = () => {
    return (
      <div key={2} className="no-active" onClick={onCoreSwitch}>
        <div style={{display: 'flex', position: 'relative'}}>
          <span>Public</span>
          <SpriteIcon name="globe" className="no-active" />
          <div className="round-button-container">
            <div className="round-button draft">{draft}</div>
            <div className="round-button build">{build}</div>
            <div className="round-button review">{review}</div>
            <div className="round-button publish">{publish}</div>
          </div>
        </div>
      </div>
    );
  }

  const getPersonalTab = () => {
    return (
      <div key={3} className="active" onClick={onCoreSwitch}>
        <div style={{display: 'flex'}}>
          <span>Personal</span>
          <SpriteIcon name="key" className="active" />
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