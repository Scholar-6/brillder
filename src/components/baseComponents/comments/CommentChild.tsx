import React from "react";
import { Comment } from "model/comments";
import moment from "moment";
import axios from "axios";
import sprite from "assets/img/icons-sprite.svg";
import { IconButton, SvgIcon } from "@material-ui/core";
import { Brick } from "model/brick";

export interface CommentChildProps {
  comment: Comment;
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

  return (
    <div className="comment-child-container">
      <div style={{position: 'absolute'}} className="profile-image-container">
        <div className="profile-image">
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
      <div>
        <small style={{marginLeft: '19%'}}>{moment(props.comment.timestamp).format("H:mm D MMM")}</small>
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
