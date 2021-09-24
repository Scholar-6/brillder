import React from 'react';
import './CommentIndicator.scss';

interface IndicatorProps {
  replyType: number;
}

const CommentIndicator: React.FC<IndicatorProps> = ({replyType}) => {
  if (replyType === 0) {
    return <div style={{width: 0}}></div>;
  }
  return (
    <div className={"unread-indicator" + (replyType > 0 ? " has-replied" : "")}>
      <div className="inner-circle"></div>
    </div>
  );
}

export default CommentIndicator;
