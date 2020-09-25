import React from 'react';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';

import './CommentPanel.scss';
import sprite from "assets/img/icons-sprite.svg";
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
  haveBackButton?: boolean;
  getComments(brickId: number): void;
  createComment(comment: any): void;
  setCommentsShown?(value: boolean): void;
}

const CommentPanel: React.FC<CommentPanelProps> = props => {
  if (!props.comments) {
    props.getComments(props.currentBrick.id);
    return <div>Loading comments...</div>;
  }

  console.log(props.comments);

  const renderComments = () => {
    return (
      <div className="comments-column-wrapper">
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
              {comment.children && comment.children.map(child => {
                console.log(child)
                  return (
                <CommentChild
                  key={child.id}
                  comment={child}
                  currentBrick={props.currentBrick}
                  isAuthor={child.author.id === props.currentUser.id} />
                  );
                }
              )}
            </CommentItem>
          )) : ""}
        </Grid>
      </div>
    );
  }

  const hideComments = () => {
    if (props.setCommentsShown) {
      props.setCommentsShown(false);
    }
  }

  const renderBackButton = () => {
    if (!props.haveBackButton) { return; }
    return (
      <svg className="svg active" onClick={hideComments}>
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#arrow-left"} />
      </svg>
    );
  }

  return (
    <Grid container className="comments-panel" direction="column" alignItems="stretch">
      <Grid item >
        <div className="comments-title">
          {renderBackButton()}
           Suggestions
        </div>
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
