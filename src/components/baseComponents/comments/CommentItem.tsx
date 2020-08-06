import React from 'react';
import { Grid,/* Box,*/ SvgIcon, IconButton, Collapse } from '@material-ui/core';
//import { green, red } from '@material-ui/core/colors';
//import { withStyles/*, createMuiTheme, ThemeProvider*/ } from '@material-ui/core/styles';

import sprite from "assets/img/icons-sprite.svg";

//import { CommentChildProps } from './CommentChild';

import moment from 'moment';
import ReplyCommentPanel from './ReplyCommentPanel';
import { Comment } from 'model/comments';
//import { User } from 'model/user';
import { Brick } from 'model/brick';
import axios from 'axios';

interface CommentItemProps {
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
  <Grid item>
    <div className="comment-item-container">
      <Grid container direction="column">
        <Grid item container direction="row">
          <Grid className="stretch" item>
            <h4><b>{props.comment.author.firstName} {props.comment.author.lastName}</b></h4>
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
        <Grid item>
          <h5 style={{ marginBottom: "10px" }}>{moment(props.comment.timestamp).format("H:mm D MMM")}</h5>
        </Grid>
        <Grid item>
          <b>Comment: </b><i>{props.comment.text}</i>
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