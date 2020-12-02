import React from 'react';
import './CommentIndicator.scss';

interface IndicatorProps {
  replyType: number;
}

const CommentIndicator: React.FC<IndicatorProps> = ({replyType}) => {
  if (replyType === 0) {
    return <div></div>;
  }
  return (
    <div className={"unread-indicator" + (replyType > 0 ? " has-replied" : "")}>
      <div className="outer-circle"></div>
      <div className="inner-circle"></div>
    </div>
  );
}

export default CommentIndicator;
