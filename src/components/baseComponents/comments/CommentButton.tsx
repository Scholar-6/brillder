import React, { useState, useEffect } from 'react';
//@ts-ignore
import { connect } from 'react-redux';

import { SvgIcon, Fab, Popover, Typography } from '@material-ui/core';
import sprite from "assets/img/icons-sprite.svg";
import CommentPopup from './CommentPopup';
import { ReduxCombinedState } from 'redux/reducers';
import { User } from 'model/user';
import { Comment } from 'model/comments';
import comments from 'redux/actions/comments';
import { Brick } from 'model/brick';

interface CommentButtonProps {
    commentId: number;
    currentUser: User;
    currentBrick: Brick;
    comments: Comment[];
    getComments(brickId: number): void;
    deleteComment(commentId: number): void;
    changeText(commentId: number, text: string): void;
}

const CommentButton: React.FC<CommentButtonProps> = (props) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handlePress = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    useEffect(() => {
        if(props.comments && props.comments.filter((comment) => comment.id == props.commentId).length === 0) {
            props.deleteComment(props.commentId);
        }
    }, [props.comments]);

    useEffect(() => {
        if(!props.comments) {
            props.getComments(props.currentBrick.id);
        }
    }, [props.comments])

    if(!props.comments) {
        return <div>Loading comments...</div>
    }
    console.log(props.comments);
    const comment = props.comments.filter((comment) => comment.id == props.commentId)[0];

    if(!comment) {
        return <span>Nothing here yet...</span>
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
                    props.changeText(commentId, text);
                }} text={comment.text} editable={props.currentUser.id == comment.author.id} commentId={props.commentId} />
            </Popover>
        </span>
    );
}

const mapState = (state: ReduxCombinedState) => ({
    currentUser: state.user.user,
    comments: state.comments.comments,
    currentBrick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
    getComments: (brickId: number) => dispatch(comments.getComments(brickId))
});

const connector = connect(mapState, mapDispatch);

export default connector(CommentButton);