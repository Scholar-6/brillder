import React from 'react';

export interface CommentChildProps {
    text: string;
    timestamp: Date;
}

const CommentChild: React.FC<CommentChildProps> = props => {
    return (
    <div>{props.text}</div>
    )
}

export default CommentChild;