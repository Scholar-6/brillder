import SpriteIcon from "components/baseComponents/SpriteIcon";
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
        <SpriteIcon name="feather-watch" />IN PROGRESS
      </span>
      <span className={isPublish ? 'active' : ''} onClick={() => {
        if (!isPublish) {
          onSwitch();
        }
      }}>
        <SpriteIcon name="feather-award" /> PUBLISHED ({props.publishedCount})
      </span>
    </div>
  );
}

export default PublishToggle;
