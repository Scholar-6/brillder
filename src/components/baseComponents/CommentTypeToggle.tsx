import React from "react";

import './CommentTypeToggle.scss';
import SpriteIcon from "./SpriteIcon";

interface ToggleProps {
  mode: boolean | null;
  onSwitch(): void;
}

const CommentTypeToggle: React.FC<ToggleProps> = props => {
  const {mode} = props;

  const renderCoreIcon = () => {
    let className = "svg active";
    if (mode) {
      className += " selected";
    }
    return <div className={className}>
      <SpriteIcon name="pen-tool" />
    </div>
  }

  const renderPrivateIcon = () => {
    let className = "svg active";
    if (!mode) {
      className += " selected";
    }
    return <div className={className}>
      <SpriteIcon name="message-square" />
    </div>;
  }

  return (
    <div className="comment-type-toggle">
      <button className="btn btn btn-transparent " onClick={props.onSwitch}>
        <div className="svgOnHover">
          {renderCoreIcon()}
          {renderPrivateIcon()}
        </div>
      </button>
    </div>
  );
};

export default CommentTypeToggle;
