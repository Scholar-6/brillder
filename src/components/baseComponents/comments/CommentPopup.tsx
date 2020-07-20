import React from 'react';

import { Button, Grid, TextField } from '@material-ui/core';

interface CommentPopupProps {
    commentId: number;
    text: string;
    editable: boolean;
    deleteComment(commentId: number): void;
    changeText(commentId: number, text: string): void;
}

const CommentPopup: React.FC<CommentPopupProps> = (props) => {

    const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.changeText(props.commentId, event.target.value);
    };

    return (
    <Grid container direction="column">
        <Button onClick={() => props.deleteComment(props.commentId)}>Delete Comment</Button>
        <TextField variant="outlined" defaultValue={props.text} onChange={onChangeText}
            InputProps={{
                readOnly: !props.editable,
            }}/>
    </Grid>
    );
}

export default CommentPopup;