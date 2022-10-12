import React from "react";

interface ToggleProps {
  isPublish: boolean;
  onSwitch(v: boolean): void;
}

const DPublishToggle: React.FC<ToggleProps> = ({isPublish, onSwitch}) => {
  return (
    <div className="publish-toggle">
      <span className={isPublish ? '' : 'active'} onClick={() => {
        if (isPublish) {
          onSwitch(false);
        }
      }}>
        PLAYED
      </span>
      <span className={isPublish ? 'active' : ''} onClick={() => {
        if (!isPublish) {
          onSwitch(true);
        }
      }}>
        PUBLISHED
      </span>
    </div>
  );
}

export default DPublishToggle;
