import React from 'react';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';

import './CommentPanel.scss';
import { ReduxCombinedState } from 'redux/reducers';
import comments from 'redux/actions/comments';
import { Comment, CommentLocation } from 'model/comments';
import { Brick } from 'model/brick';
import { User } from 'model/user';
import { deleteComment } from 'services/axios/brick';

import CommentItem from './CommentItem';
import CommentChild from './CommentChild';
import NewCommentPanel from './NewCommentPanel';
import CommentDeleteDialog from './CommentDeleteDialog';
import SpriteIcon from '../SpriteIcon';


interface CommentPanelProps {
  mode?: boolean; // true - hidden
  currentBrick: Brick;
  currentQuestionId?: number;
  currentLocation: CommentLocation;
  haveBackButton?: boolean;
  setCommentsShown?(value: boolean): void;
  onHeaderClick?(): void;

  //redux
  comments: Comment[] | null;
  currentUser: User;
  getComments(brickId: number): void;
  createComment(comment: any): void;
}

const CommentPanel: React.FC<CommentPanelProps> = props => {
  const initDeleteData = { isOpen: false, brickId: -1, commentId: -1 }
  const [deleteData, setDeleteData] = React.useState(initDeleteData);

  if (!props.comments) {
    props.getComments(props.currentBrick.id);
    return <div>Loading comments...</div>;
  }

  console.log('CommentPanel. Comments: ', props.comments);

  const onDelete = (brickId: number, commentId: number) => {
    console.log('wef')
    setDeleteData({ isOpen: true, brickId, commentId });
  }

  const renderComments = () => {
    return (
      <div className="comments-column-wrapper">
        <Grid container direction="column" className="comments-column">
          {props.comments && props.comments.map(comment => (
            comment.location === props.currentLocation &&
            (comment.location !== CommentLocation.Question ||
              comment.question?.id === props.currentQuestionId)
            &&
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={props.currentUser}
              currentBrick={props.currentBrick}
              createComment={props.createComment}
              isAuthor={comment.author.id === props.currentUser.id}
              onDelete={onDelete}
            >
              {comment.children && comment.children.map(child =>
                <CommentChild
                  key={child.id}
                  comment={child}
                  currentUser={props.currentUser}
                  currentBrick={props.currentBrick}
                  isAuthor={child.author.id === props.currentUser.id}
                  onDelete={onDelete}
                />
              )}
            </CommentItem>
          ))}
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
    return <SpriteIcon name="arrow-left" className="active" onClick={hideComments} />;
  }

  if (props.mode === true) {
    return (
      <Grid container className="comments-panel" direction="column" alignItems="stretch">
        <Grid item onClick={props.onHeaderClick}>
          <div className="comments-title">
            {renderBackButton()}
             Suggestions
             <button className="btn-transparent filter-icon arrow-down" />
          </div>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container className="comments-panel" direction="column" alignItems="stretch">
      <Grid item onClick={props.onHeaderClick}>
        <div className="comments-title">
          {renderBackButton()}
           Suggestions
           {props.mode === false && <button className="btn-transparent filter-icon arrow-up" />}
        </div>
      </Grid>
      <Grid item>
        <NewCommentPanel
          currentQuestionId={props.currentQuestionId}
          currentBrick={props.currentBrick}
          createComment={props.createComment}
          currentLocation={props.currentLocation} />
      </Grid>
      {renderComments()}
      <CommentDeleteDialog
        isOpen={deleteData.isOpen}
        submit={() => {
          deleteComment(deleteData.brickId, deleteData.commentId);
          setDeleteData(initDeleteData)
        }}
        close={() => setDeleteData(initDeleteData)} />
    </Grid>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  comments: state.comments.comments,
  currentUser: state.user.user
});

const mapDispatch = (dispatch: any) => ({
  getComments: (brickId: number) => dispatch(comments.getComments(brickId)),
  createComment: (comment: any) => dispatch(comments.createComment(comment))
});

const connector = connect(mapState, mapDispatch);

export default connector(CommentPanel);
