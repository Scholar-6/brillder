import React from 'react';

interface CommentButtonProps {
    commentId: number;
    text: string;
}

const CommentButton: React.FC<CommentButtonProps> = (props) => {
    return (
        <span className="comment-button" data-id={props.commentId}>
            <svg width="10" height="10">
                <circle cx="50%" cy="50%" r="50%" fill="#000044" />
            </svg>
        </span>
    );
}

export default CommentButton;