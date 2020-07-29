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

const CommentPanel: React.FC = () => {
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
                <CommentItem text="This is a comment!" />
                <CommentItem text="This is another comment!" />
                <CommentItem text="I think you should probably change this..." />
            </ScrollGrid>
        </Grid>
    </Box>
    );
};

export default CommentPanel;