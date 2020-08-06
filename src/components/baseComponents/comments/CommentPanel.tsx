import React from 'react';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';

import './CommentPanel.scss';
import CommentItem from './CommentItem';
import { ReduxCombinedState } from 'redux/reducers';

import comments from 'redux/actions/comments';
import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import CommentChild from './CommentChild';
import NewCommentPanel from './NewCommentPanel';
import { User } from 'model/user';


interface CommentPanelProps {
  comments: Comment[] | null;
  currentBrick: Brick;
  currentQuestionId?: number;
  currentUser: User;
  getComments(brickId: number): void;
  createComment(comment: any): void;
}

const CommentPanel: React.FC<CommentPanelProps> = props => {
  if (!props.comments) {
    props.getComments(props.currentBrick.id);
    return <div>Loading comments...</div>;
  }

  const renderComments = () => {
    return (
      <Grid container direction="column" className="comments-column">
        {props.comments ? props.comments.map(comment => (
          (comment.question?.id ?? -1) === (props.currentQuestionId ?? -1)
          &&
          <CommentItem
            key={comment.id}
            comment={comment}
            currentBrick={props.currentBrick}
            createComment={props.createComment}
            isAuthor={comment.author.id === props.currentUser.id}>
            {comment.children && comment.children.map(child => (
              <CommentChild
                key={child.id}
                comment={child}
                currentBrick={props.currentBrick}
                isAuthor={child.author.id === props.currentUser.id} />
            ))}
          </CommentItem>
        )) : ""}
      </Grid>
    );
  }

  return (
    <Grid container className="comments-panel" direction="column" alignItems="stretch">
      <Grid item>
        <div className="comments-title">Suggestions</div>
      </Grid>
      <Grid item>
        <NewCommentPanel
          currentQuestionId={props.currentQuestionId}
          currentBrick={props.currentBrick}
          createComment={props.createComment} />
      </Grid>
      {renderComments()}
    </Grid>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  comments: state.comments.comments,
  currentBrick: state.brick.brick,
  currentUser: state.user.user
});

const mapDispatch = (dispatch: any) => ({
  getComments: (brickId: number) => dispatch(comments.getComments(brickId)),
  createComment: (comment: any) => dispatch(comments.createComment(comment))
});

const connector = connect(mapState, mapDispatch);

export default connector(CommentPanel);
