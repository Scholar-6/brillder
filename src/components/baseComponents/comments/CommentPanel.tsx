import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import {
    createStyles,
    withStyles,
    Theme
} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { green } from '@material-ui/core/colors';
import CommentItem from './CommentItem';
import { ReduxCombinedState } from 'redux/reducers';
// @ts-ignore
import { connect } from 'react-redux';
import comments from 'redux/actions/comments';
import { Comment } from 'model/comments';
import { Brick } from 'model/brick';

const PreviewButton = withStyles((theme: Theme) => ({
    root: {
        color: "#ffffff",
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
        width: "100%",
        fontSize: 25,
        letterSpacing: 7
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
    if(!props.comments) {
        props.getComments(props.currentBrick.id);
        return <div>Loading comments...</div>;
    }

    return (
    <Box marginLeft={3} bgcolor="#e4e7f0" height="100%" clone>
        <Grid container direction="column" alignItems="stretch">
            <Grid item>
                <Box textAlign="center" fontSize={20} letterSpacing={4} fontFamily="Brandon Grotesque Black" py={1}>DONE EDITING?</Box>
            </Grid>
            <Grid item>
                <PreviewButton disableElevation>PREVIEW</PreviewButton>
            </Grid>
            <ScrollGrid item container direction="column">
                {props.comments.map(comment => (
                <CommentItem text={comment.text} timestamp={comment.timestamp} />
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