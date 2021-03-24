import React, { useEffect } from 'react';
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
import SpriteIcon from '../SpriteIcon';
import CommentIndicator from 'components/build/baseComponents/CommentIndicator';
import DeleteDialog from 'components/build/baseComponents/dialogs/DeleteDialog';


interface CommentPanelProps {
  isPlanBrief?: boolean;
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
  createComment(comment: any): Promise<void>;
}

const CommentPanel: React.FC<CommentPanelProps> = props => {
  const initDeleteData = { isOpen: false, brickId: -1, commentId: -1 }
  const [deleteData, setDeleteData] = React.useState(initDeleteData);
  const [scrollArea] = React.useState(React.createRef() as React.RefObject<HTMLDivElement>);
  const [canScroll, setScroll] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      let {current} = scrollArea;
      if (current) {
        if (current.scrollHeight > current.clientHeight) {
          if (!canScroll) {
            setScroll(true);
          }
        } else {
          if (canScroll) {
            setScroll(false);
          }
        }
      }
    }, 100);
  });

  if (!props.comments) {
    props.getComments(props.currentBrick.id);
    return <div>Loading comments...</div>;
  }

  // 10/23/2020 too much logs
  //console.log('CommentPanel. Comments: ', props.comments);

  const onDelete = (brickId: number, commentId: number) => {
    setDeleteData({ isOpen: true, brickId, commentId });
  }

  /**
   * Create comment and move to scroll to it
   * @param comment New Comment
   */
  const createCommentAndScroll = (comment: any) => {
    console.log('create comment');
    props.createComment(comment).then(() => {
      // wait for rerender
      setTimeout(() => {
        const {current} = scrollArea;
        if (current) {
          current.scrollBy(0, window.screen.height);
        }
      }, 400)
    });
  }

  const getLatestChild = (comment: Comment) => {
    if(!comment.children || comment.children.length <= 0) {
      return comment;
    }
    const replies = comment.children.sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf());
    return replies[0];
  }

  const getHasBriefReplied = () => {
    const replies = props.comments?.filter(comment => comment.location === CommentLocation.Brief)
      .map(getLatestChild)
      .sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf());
    if (replies && replies.length > 0) {
      const latestAuthor = replies[0].author.id;
      const isCurrentUser = latestAuthor === props.currentUser.id;
      return isCurrentUser ? 1 : -1;
    } else {
      return 0;
    }
  }

  const renderIndicator = () => {
    if (props.isPlanBrief) {
      return <CommentIndicator replyType={getHasBriefReplied()} />;
    }
  }

  const renderComments = () => {
    return (
      <div className="comments-column-wrapper">
        <Grid container direction="column" className="comments-column" ref={scrollArea}>
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

  const scrollUp = () => {
    const {current} = scrollArea;
    if (current) {
      current.scrollBy(0, -window.screen.height / 30);
    }
  }

  const scrollDown = () => {
    const {current} = scrollArea;
    if (current) {
      current.scrollBy(0, window.screen.height / 30);
    }
  }

  const renderBackButton = () => {
    if (!props.haveBackButton) { return; }
    return <SpriteIcon name="arrow-left" className="active" onClick={hideComments} />;
  }

  if (props.mode === true) {
    return (
      <Grid container className="comments-panel" direction="column" alignItems="stretch">
        {renderIndicator()}
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

  let className= 'scroll-arrow'
  if (!canScroll) {
    className += ' disabled';
  }

  return (
    <Grid container className="comments-panel customize-panel" direction="column" alignItems="stretch">
      {renderIndicator()}
      <Grid item onClick={props.onHeaderClick}>
        <div className="comments-title">
          {renderBackButton()}
           <span>Suggestions</span>
           {props.mode === false && <button className="btn-transparent filter-icon arrow-up" />}
        </div>
      </Grid>
      <Grid item>
        <NewCommentPanel
          currentQuestionId={props.currentQuestionId}
          currentBrick={props.currentBrick}
          createComment={createCommentAndScroll}
          currentLocation={props.currentLocation}
        />
      </Grid>
      <div className="scroll-buttons">
        <SpriteIcon name="arrow-up" className={className} onClick={scrollUp} />
        <SpriteIcon name="arrow-down" className={className} onClick={scrollDown} />
      </div>
      {renderComments()}
      <DeleteDialog
        isOpen={deleteData.isOpen}
        title="Are you sure you want to delete this comment?"
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
