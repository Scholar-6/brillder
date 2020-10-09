import React from "react";

interface ToggleProps {
  isPublish: boolean;
  publishedCount: number;
  onSwitch(): void;
}

const PublishToggle: React.FC<ToggleProps> = ({isPublish, onSwitch, ...props}) => {
  return (
    <div className="publish-toggle">
      <span className={isPublish ? '' : 'active'} onClick={() => {
        if (isPublish) {
          onSwitch();
        }
      }}>
        IN PROGRESS
      </span>
      <span className={isPublish ? 'active' : ''} onClick={() => {
        if (!isPublish) {
          onSwitch();
        }
      }}>
        PUBLISHED ({props.publishedCount})
      </span>
    </div>
  );
}

export default PublishToggle;
