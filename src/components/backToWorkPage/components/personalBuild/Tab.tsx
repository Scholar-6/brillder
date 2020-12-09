import React from "react";
import SpriteIcon from "components/baseComponents/SpriteIcon";

interface TabProps {
  draft: number;
  build: number;
  review: number;
  publish: number;
  onCoreSwitch(): void;
}

const TabComponent: React.FC<TabProps> = (props) => {
  const getPublicTab = () => {
    return (
      <div key={2} className="no-active" onClick={props.onCoreSwitch}>
        <div style={{ display: "flex", position: "relative" }}>
          <span>Public</span>
          <SpriteIcon name="globe" className="no-active" />
          <div className="round-button-container">
            <div className="round-button draft">{props.draft}</div>
            <div className="round-button build">{props.build}</div>
            <div className="round-button review">{props.review}</div>
            <div className="round-button publish">{props.publish}</div>
          </div>
        </div>
      </div>
    );
  };

  const getPersonalTab = () => {
    return (
      <div key={3} className="active">
        <div style={{ display: "flex" }}>
          <span>Personal</span>
          <SpriteIcon name="key" className="active" />
        </div>
      </div>
    );
  };

  return (
    <div className="tab-container">
      {getPublicTab()}
      {getPersonalTab()}
    </div>
  );
};

export default TabComponent;
