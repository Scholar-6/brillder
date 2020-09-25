import React from "react";
import axios from "axios";
import moment from "moment";
import { IconButton, SvgIcon } from "@material-ui/core";

import sprite from "assets/img/icons-sprite.svg";
import { Comment } from "model/comments";
import { Brick } from "model/brick";
import { User } from "model/user";

export interface CommentChildProps {
  comment: Comment;
  currentUser: User;
  currentBrick: Brick;
  isAuthor: boolean;
}

const CommentChild: React.FC<CommentChildProps> = (props) => {
  const handleDeleteComment = () => {
    return axios.delete(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/${props.currentBrick.id}/comment/${props.comment.id}`,
      { withCredentials: true }
    );
  };

  let mineComment = false;
  if (props.comment.author.id === props.currentUser.id) {
    mineComment = true;
  }

  return (
    <div className="comment-child-container">
      <div style={{position: 'absolute'}} className="profile-image-container">
        <div className={`profile-image ${mineComment ? 'red-border' : 'yellow-border'}`}>
          {
            props.comment.author?.profileImage
              ? <img src={`${process.env.REACT_APP_BACKEND_HOST}/files/${props.comment.author.profileImage}`} />
              : <svg><use href={sprite + "#user"} /></svg>
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
            onClick={() => handleDeleteComment()}
          >
            <SvgIcon fontSize="inherit">
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#cancel"} />
              </svg>
            </SvgIcon>
          </IconButton>
        )}
      </div>
      <div className="comment-date">
        <small>{moment(props.comment.timestamp).format("H:mm D MMM")}</small>
      </div>
      <div>
        <i>
          {props.comment.text === "" ? "No text inserted" : props.comment.text}
        </i>
      </div>
    </div>
  );
};

export default CommentChild;
