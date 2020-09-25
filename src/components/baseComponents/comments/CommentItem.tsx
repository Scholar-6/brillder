import React from 'react';
import moment from 'moment';
import axios from 'axios';
import { Grid, SvgIcon, IconButton, Collapse } from '@material-ui/core';
//@ts-ignore
import Hyphenated from 'react-hyphen';
//@ts-ignore
import gb from 'hyphenated-en-gb';

import sprite from "assets/img/icons-sprite.svg";

import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import { User } from 'model/user';

import ReplyCommentPanel from './ReplyCommentPanel';

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
        <Grid item container direction="row" style={{position: 'relative'}}>
          <div style={{position: 'absolute'}} className="profile-image-container">
            <div className={`profile-image ${props.isAuthor ? 'red-border' : 'yellow-border'}`}>
              {
                props.comment.author?.profileImage
                  ? <img src={`${process.env.REACT_APP_BACKEND_HOST}/files/${props.comment.author.profileImage}`} />
                  : <svg><use href={sprite + "#user"} /></svg>
                }
            </div>
          </div>
          <Grid className="stretch" item>
            <h4>{props.comment.author.firstName} {props.comment.author.lastName}</h4>
          </Grid>
          <div className="buttons-container">
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
          </div>
        </Grid>
        <h5 className="comment-date">{moment(props.comment.timestamp).format("H:mm D MMM")}</h5>
        <Grid item className="comment-text break-word">
          <span className="bold">Comment: </span>
          <Hyphenated language={gb}>
            <i>{props.comment.text}</i>
          </Hyphenated>
        </Grid>
        {/*eslint-disable-next-line*/}
        {props.children && props.children instanceof Array && props.children.length != 0 &&
        <div className="comment-reply-container">
          {props.children}
        </div>}
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
