import React from 'react';
import { Grid,/* Box,*/ SvgIcon, IconButton, Collapse } from '@material-ui/core';
//@ts-ignore
import Hyphenated from 'react-hyphen';
//@ts-ignore
import gb from 'hyphenated-en-gb';

import sprite from "assets/img/icons-sprite.svg";

import moment from 'moment';
import ReplyCommentPanel from './ReplyCommentPanel';
import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import axios from 'axios';
import { User } from 'model/user';

interface CommentItemProps {
  currentUser: User;
  comment: Comment;
  isAuthor: boolean;
  currentBrick: Brick;
  createComment(comment: any): void;
}

const CommentItem: React.FC<CommentItemProps> = props => {
  const [replyPanelShown, setReplyPanelShown] = React.useState(false);

  const handleDeleteComment = () => {
    return axios.delete(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/${props.currentBrick.id}/comment/${props.comment.id}`,
      { withCredentials: true }
    );
  }


  return (
  <Grid item className="comment-container">
    <div className="comment-item-container">
      <Grid container direction="column">
        <Grid item container direction="row">
          <div style={{position: 'absolute'}} className="profile-image-container">
            <div className="profile-image">
              {
                props.currentUser.profileImage
                  ? <img src={`${process.env.REACT_APP_BACKEND_HOST}/files/${props.currentUser.profileImage}`} />
                  : <svg><use href={sprite + "#user"} /></svg>
                }
            </div>
          </div>
          <Grid className="stretch" item>
            <h4>{props.comment.author.firstName} {props.comment.author.lastName}</h4>
          </Grid>
          {props.isAuthor &&
          <IconButton aria-label="delete" size="small" color="secondary"
            onClick={() => handleDeleteComment()}>
            <SvgIcon fontSize="inherit">
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#cancel"} />
              </svg>
            </SvgIcon>
          </IconButton>}
          <IconButton aria-label="reply" size="small" color="primary"
            onClick={() => setReplyPanelShown(!replyPanelShown)}>
            <SvgIcon fontSize="inherit">
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#message-square"} />
              </svg>
            </SvgIcon>
          </IconButton>
        </Grid>
        <h5 style={{ marginLeft: '19%', marginBottom: "10px" }}>{moment(props.comment.timestamp).format("H:mm D MMM")}</h5>
        <Grid item className="break-word">
          <span className="bold">Comment: </span>
          <Hyphenated language={gb}>
            <i>{props.comment.text}</i>
          </Hyphenated>
        </Grid>
        {/*eslint-disable-next-line*/}
        {props.children && props.children instanceof Array && props.children.length != 0 &&
        <Grid className="comment-reply-container" item container direction="column">
          {props.children}
        </Grid>}
        <Collapse in={replyPanelShown}>
          <ReplyCommentPanel
            parentComment={props.comment}
            currentBrick={props.currentBrick}
            collapsePanel={() => setReplyPanelShown(false)}
            createComment={props.createComment} />
        </Collapse>
      </Grid>
    </div>
  </Grid>
  )
};

export default CommentItem;
