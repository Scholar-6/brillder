import React from 'react';
import { Comment, CommentLocation } from 'model/comments';
import { User } from 'model/user';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';

import './CommentButton.scss';

interface CommentButtonProps {
  location: CommentLocation;
  questionId?: number;
  currentUser: User;
  comments: Comment[] | null;
  setCommentsShown(commentsShown: boolean): void;
}

const CommentButton: React.FC<CommentButtonProps> = (props) => {
  const [hovered, setHover] = React.useState(false);

  const getNumberOfReplies = () => {
    const replies = props.comments?.filter(comment =>
      (comment.location === props.location) &&
      (comment.location === CommentLocation.Question ? (comment.question?.id ?? -1) === props.questionId : true))
      .map(getLatestChild)
      .sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf());
    if (replies && replies.length > 0) {
      let currentIndex = 0;
      const latestAuthor = replies[0].author.id;
      while (currentIndex < replies.length
        && replies[currentIndex].author.id === latestAuthor) {
        currentIndex += 1;
      }
      const isCurrentUser = latestAuthor === props.currentUser.id;
      return isCurrentUser ? currentIndex : -currentIndex;
    } else {
      return 0;
    }
  }

  const getLatestChild = (comment: Comment) => {
    if (!comment.children || comment.children.length <= 0) {
      return comment;
    }
    const replies = comment.children.sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf());
    return replies[0];
  }

  
  let numberOfReplies = getNumberOfReplies();
  if (numberOfReplies !== 0) {
    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={"comment-button " + (numberOfReplies > 0 ? "has-replied" : "active") + " animated pulse-orange iteration-2 duration-1s"}
        onClick={() => props.setCommentsShown(true)}
      >
        <div className="comments-icon svgOnHover">
          <SpriteIcon name="message-square" className="w60 h60 active" />
        </div>
        <div className="comments-count">
          {numberOfReplies > 0 ? numberOfReplies : -numberOfReplies}
        </div>
        {hovered && <div className="custom-tooltip bigger">
          {numberOfReplies <= 1 ? 'View Comment' : 'View Comments'}
        </div>}
      </div>
    );
  }

  return (
    <div
      className="comment-button empty"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => props.setCommentsShown(true)}
    >
      <div className="comments-icon svgOnHover">
        <SpriteIcon name="message-square" className="w60 h60 active" />
      </div>
      <div className="comments-plus svgOnHover">
        <SpriteIcon name="plus-line-custom" className="w60 h60 active" />
      </div>
      {hovered && <div className="custom-tooltip">Add comment</div>}
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  comments: state.comments.comments,
  currentUser: state.user.user
});

const connector = connect(mapState);

export default connector(CommentButton);