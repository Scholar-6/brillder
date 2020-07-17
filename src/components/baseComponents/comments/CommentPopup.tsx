import React from 'react';

import { Button, Grid, Typography } from '@material-ui/core';

interface CommentPopupProps {
    commentId: number;
    text: string;
    deleteComment(commentId: number): void;
}

const CommentPopup: React.FC<CommentPopupProps> = (props) => {
    return (
    <Grid container direction="column">
        <Button onClick={() => props.deleteComment(props.commentId)}>Delete Comment</Button>
        <Typography>{props.text}</Typography>
    </Grid>
    );
}

export default CommentPopup;