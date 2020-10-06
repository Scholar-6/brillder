import React from 'react';
import moment from 'moment';
import { Grid, Collapse } from '@material-ui/core';
//@ts-ignore
import Hyphenated from 'react-hyphen';
//@ts-ignore
import gb from 'hyphenated-en-gb';

import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import { User } from 'model/user';

import ReplyCommentPanel from './ReplyCommentPanel';
import SpriteIcon from '../SpriteIcon';

interface CommentItemProps {
  currentUser: User;
  comment: Comment;
  isAuthor: boolean;
  currentBrick: Brick;
  createComment(comment: any): void;
  onDelete(brickId: number, commentId: number): void;
}

const CommentItem: React.FC<CommentItemProps> = props => {
  const [replyPanelShown, setReplyPanelShown] = React.useState(false);

  return (
  <Grid item className="comment-container">
    <div className="comment-item-container">
      <Grid container direction="column">
        <Grid item container direction="row" style={{position: 'relative'}}>
          <div style={{position: 'absolute'}} className="profile-image-container">
            <div className={`profile-image ${props.isAuthor ? 'yellow-border' : 'red-border'}`}>
              {
                props.comment.author?.profileImage
                  ? <img alt="" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${props.comment.author.profileImage}`} />
                  : <SpriteIcon name="user" />
                }
            </div>
          </div>
          <Grid className="stretch" item>
            <h4>{props.comment.author.firstName} {props.comment.author.lastName}</h4>
          </Grid>
          <div className="buttons-container">
          <button aria-label="reply" className="message-button svgOnHover" onClick={() => setReplyPanelShown(!replyPanelShown)}>
            <SpriteIcon name="corner-up-left" className="active" />
          </button>
            {props.isAuthor &&
              <button
                aria-label="delete"
                className="cancel-button svgOnHover"
                onClick={() => props.onDelete(props.currentBrick.id, props.comment.id)}
              >
                <SpriteIcon name="trash-outline" className="active" />
              </button>
            }
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
