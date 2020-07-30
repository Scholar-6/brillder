import React from 'react';
import { Grid, Button, Collapse } from '@material-ui/core';
import {
    withStyles,
    Theme
} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { green, blue } from '@material-ui/core/colors';
import CommentItem from './CommentItem';
import { ReduxCombinedState } from 'redux/reducers';
// @ts-ignore
import { connect } from 'react-redux';
import comments from 'redux/actions/comments';
import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import CommentChild from './CommentChild';
import NewCommentPanel from './NewCommentPanel';

const NewCommentButton = withStyles((theme: Theme) => ({
    root: {
        color: "#ffffff",
        backgroundColor: blue[500],
        '&:hover': {
            backgroundColor: blue[700],
        },
        width: "100%",
        fontSize: 25,
        letterSpacing: 7,
        borderRadius: 0
    }
}))(Button);

const ScrollGrid = withStyles({
    root: {
        overflow: "scroll"
    }
})(Grid);

interface CommentPanelProps {
    comments: Comment[];
    currentBrick: Brick;
    getComments(brickId: number): void;
}

const CommentPanel: React.FC<CommentPanelProps> = props => {
    const [panelShown, setPanelShown] = React.useState(false);

    if(!props.comments) {
        props.getComments(props.currentBrick.id);
        return <div>Loading comments...</div>;
    }

    return (
    <Box marginLeft={3} bgcolor="#e4e7f0" height="100%" borderRadius={10} clone>
        <Grid container direction="column" alignItems="stretch">
            <Grid item>
                <Box textAlign="center" fontSize={20} letterSpacing={4} fontFamily="Brandon Grotesque Black" py={1}>COMMENTS</Box>
            </Grid>
            <Grid item>
                <NewCommentButton disableElevation onClick={() => setPanelShown(!panelShown)}>NEW COMMENT</NewCommentButton>
                <Collapse in={panelShown}>
                    <NewCommentPanel />
                </Collapse>
            </Grid>
            <ScrollGrid item container direction="column">
                {props.comments.map(comment => (
                <CommentItem text={comment.text} timestamp={comment.timestamp}>
                    {comment.children && comment.children.map(child => (
                        <CommentChild text={child.text} timestamp={child.timestamp} />
                    ))}
                </CommentItem>
                ))}
            </ScrollGrid>
        </Grid>
    </Box>
    );
};

const mapState = (state: ReduxCombinedState) => ({
    comments: state.comments.comments,
    currentBrick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
    getComments: (brickId: number) => dispatch(comments.getComments(brickId))
});

const connector = connect(mapState, mapDispatch);

export default connector(CommentPanel);