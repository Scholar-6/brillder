import React from "react";

interface ToggleProps {
  isPublish: boolean;
  publishedCount: number;
  onSwitch(value: boolean): void;
}

const PublishToggle: React.FC<ToggleProps> = ({isPublish, onSwitch, ...props}) => {
  return (
    <div className="publish-toggle">
      <span className={isPublish ? '' : 'active'} onClick={() => onSwitch(false)}>
        IN PROGRESS
      </span>
      <span className={isPublish ? 'active' : ''} onClick={() => onSwitch(true)}>
        PUBLISHED ({props.publishedCount})
      </span>
    </div>
  );
}

export default PublishToggle;
