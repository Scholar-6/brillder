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
    fontSize: "25px",
    letterSpacing: 7,
    borderRadius: 0
  }
})(Button);


interface CommentPanelProps {
  comments: Comment[];
  currentBrick: Brick;
  getComments(brickId: number): void;
  createComment(comment: any): void;
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
          <CommentItem key={comment.id} comment={comment} createComment={props.createComment}>
            {comment.children && comment.children.map(child => (
              <CommentChild key={child.id} comment={child} />
            ))}
          </CommentItem>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container className="comments-panel" direction="column" alignItems="stretch">
      <Grid item>
        <div className="comments-title">COMMENTS</div>
      </Grid>
      <Grid item>
        <Button className="new-comment" disableElevation onClick={() => setPanelShown(!panelShown)}>NEW COMMENT</Button>
        <Collapse in={panelShown}>
          <NewCommentPanel collapsePanel={() => setPanelShown(false)} />
        </Collapse>
      </Grid>
      {renderComments()}
    </Grid>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  comments: state.comments.comments,
  currentBrick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
  getComments: (brickId: number) => dispatch(comments.getComments(brickId)),
  createComment: (comment: any) => dispatch(comments.createComment(comment))
});

const connector = connect(mapState, mapDispatch);

export default connector(CommentPanel);