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

import "./CommentItem.scss";

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
  const [collapsed, setCollapsed] = React.useState(false);

  const renderCollapsedView = () => {
    return (
      <Grid className="comment-item-collapsed" container direction="column" onClick={() => setCollapsed(false)}>
        <Grid item container direction="row" className="comment-collapsed-row">
          <Grid item className="comment-author">
            <h4>{props.comment.author.firstName}</h4>
            <div style={{position: 'absolute', right: 0, top: 0}}>
              <SpriteIcon name="plus-square" />
            </div>
          </Grid>
          <Grid item className="comment-text">
            <i>{props.comment.text}</i>
          </Grid>
        </Grid>
        {props.comment.children && props.comment.children.length > 0 &&
        <Grid item className="comment-reply-count">
          +{props.comment.children.length} {props.comment.children.length > 1 ? "replies" : "reply"}
        </Grid>
        }
      </Grid>
    );
  }

  const renderExpandedView = () => {
    return (
      <Grid container direction="column">
        <Grid item container direction="row" style={{position: 'relative', flexWrap:'nowrap'}}>
          <div style={{position: 'absolute'}} className="profile-image-container" onClick={() => setCollapsed(true)}>
            <div className={`profile-image ${props.isAuthor ? 'yellow-border' : 'red-border'}`}>
              {
                props.comment.author?.profileImage
                  ? <img alt="" src={`${process.env.REACT_APP_BACKEND_HOST}/files/${props.comment.author.profileImage}`} />
                  : <SpriteIcon name="user" />
                }
            </div>
          </div>
          <Grid className="stretch" item onClick={() => setCollapsed(true)}>
            <h4>{props.comment.author.firstName} {props.comment.author.lastName}</h4>
          </Grid>
          <div className="buttons-container">
              <button aria-label="reply" className="message-button svgOnHover m-r-04" onClick={() => setReplyPanelShown(!replyPanelShown)}>
                <SpriteIcon name="corner-up-left" className="active" />
              </button>
              {props.isAuthor
                ?
                <button
                  aria-label="delete"
                  className="cancel-button svgOnHover"
                  onClick={() => props.onDelete(props.currentBrick.id, props.comment.id)}
                >
                  <SpriteIcon name="trash-outline" className="active" />
                </button>
                :
                <button className="message-button svgOnHover">
                  <SpriteIcon name="minus-square" className="active" onClick={() => setCollapsed(true)} />
                </button>
              }
          </div>
        </Grid>
        <h5 className="comment-date" onClick={() => setCollapsed(true)}>
          {moment(props.comment.timestamp).format("H:mm D MMM")}
        </h5>
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
            createComment={props.createComment}
            currentQuestionId={props.comment.question?.id} />
        </Collapse>
      </Grid>
    )
  }

  return (
  <Grid item className="comment-container">
    <div className="comment-item-container">
      {collapsed
        ? renderCollapsedView()
        : renderExpandedView()
      }
    </div>
  </Grid>
  )
};

export default CommentItem;
