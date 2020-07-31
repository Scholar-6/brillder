import React from 'react';
import { Grid, Button, Collapse } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { green } from '@material-ui/core/colors';
// @ts-ignore
import { connect } from 'react-redux';

import './CommentPanel.scss';
import CommentItem from './CommentItem';
import { ReduxCombinedState } from 'redux/reducers';

import comments from 'redux/actions/comments';
import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import CommentChild from './CommentChild';
import NewCommentPanel from './NewCommentPanel';

const NewCommentButton = withStyles({
  root: {
    color: "#ffffff",
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
    width: "100%",
    fontSize: 25,
    letterSpacing: 7,
    borderRadius: 0
  }
})(Button);


interface CommentPanelProps {
  comments: Comment[];
  currentBrick: Brick;
  getComments(brickId: number): void;
}

const CommentPanel: React.FC<CommentPanelProps> = props => {
  const [panelShown, setPanelShown] = React.useState(false);

  if (!props.comments) {
    props.getComments(props.currentBrick.id);
    return <div>Loading comments...</div>;
  }

  const renderComments = () => {
    let className = "comments-column ";
    if (panelShown) {
      className += "smaller-comments";
    } else {
      className += "bigger-comments";
    }
    return (
      <Grid container direction="column" className={className}>
        {props.comments.map(comment => (
          <CommentItem comment={comment}>
            {comment.children && comment.children.map(child => (
              <CommentChild comment={child} />
            ))}
          </CommentItem>
        ))}
      </Grid>
    );
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
            <NewCommentPanel collapsePanel={() => setPanelShown(false)} />
          </Collapse>
        </Grid>
        {renderComments()}
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