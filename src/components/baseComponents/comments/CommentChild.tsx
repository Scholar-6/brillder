import React from "react";
import moment from "moment";
import { IconButton, SvgIcon } from "@material-ui/core";

import { Comment } from "model/comments";
import { Brick } from "model/brick";
import { User } from "model/user";
import SpriteIcon from "../SpriteIcon";

export interface CommentChildProps {
  comment: Comment;
  currentUser: User;
  currentBrick: Brick;
  isAuthor: boolean;
  onDelete(brickId: number, commentId: number): void;
}

const CommentChild: React.FC<CommentChildProps> = (props) => {
  let mineComment = false;
  if (props.comment.author.id === props.currentUser.id) {
    mineComment = true;
  }

  return (
    <div className="comment-child-container">
      <div style={{position: 'absolute'}} className="profile-image-container">
        <div className={`profile-image ${mineComment ? 'yellow-border' : 'red-border'}`}>
          {
            props.comment.author?.profileImage
              ? <img alt="profile" src={`${process.env.REACT_APP_AWS_S3_IMAGES_BUCKET_NAME}/files/${props.comment.author.profileImage}`} />
              : <SpriteIcon name="user" />
          }
        </div>
      </div>
      <div className="comment-head-bar">
        <div className="comment-author bold">
          {props.comment.author.firstName} {props.comment.author.lastName}
        </div>
        {props.isAuthor && (
          <IconButton
            aria-label="reply"
            size="small"
            color="secondary"
            onClick={() => props.onDelete(props.currentBrick.id, props.comment.id)}
          >
            <SvgIcon fontSize="inherit">
              <SpriteIcon name="trash-outline" className="active" />
            </SvgIcon>
          </IconButton>
        )}
      </div>
      <div className="comment-date">
        {moment(props.comment.timestamp).format("H:mm D MMM")}
      </div>
      <div className="comment-text">
        <i>
          {props.comment.text === "" ? "No text inserted" : props.comment.text}
        </i>
      </div>
    </div>
  );
};

export default CommentChild;
