import React, { useState } from 'react';

import { SvgIcon, Fab, Popover, Typography } from '@material-ui/core';
import sprite from "assets/img/icons-sprite.svg";
import CommentPopup from './CommentPopup';

interface CommentButtonProps {
    commentId: number;
    text: string;
    editable: boolean;
    deleteComment(commentId: number): void;
    changeText(commentId: number, text: string): void;
}

const CommentButton: React.FC<CommentButtonProps> = (props) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [text, setText] = React.useState<string>(props.text);

    const handlePress = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <span className="comment" data-id={props.commentId}>
            <span className="comment-content">
                {props.children}
            </span>
            <Fab onClick={handlePress} color="primary" size="small">
                <SvgIcon>
                    <svg>
                        <use href={sprite + "#comment"} />
                    </svg>
                </SvgIcon>
            </Fab>
            <Popover
                open={anchorEl !== null} 
                anchorEl={anchorEl} 
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <CommentPopup deleteComment={(commentId: number) => {
                    handleClose();
                    props.deleteComment(commentId)
                }} changeText={(commentId: number, text: string) => {
                    setText(text);
                    props.changeText(commentId, text);
                }} text={text} editable={props.editable} commentId={props.commentId} />
            </Popover>
        </span>
    );
}

export default CommentButton;