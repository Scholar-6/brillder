import React from 'react';
import { Comment } from 'model/comments';
import moment from 'moment';
import sprite from "assets/img/icons-sprite.svg";
import { IconButton, SvgIcon } from '@material-ui/core';

export interface CommentChildProps {
  comment: Comment,
  isAuthor: boolean
}

const CommentChild: React.FC<CommentChildProps> = props => {
	return (
	<div className="comment-child-container">
		<div className="comment-head-bar">
			<b className="comment-author">{props.comment.author.firstName} {props.comment.author.lastName}</b>
			<small>{moment(props.comment.timestamp).format("H:mm D MMM")}</small>
			{props.isAuthor &&
			<IconButton aria-label="reply" size="small" color="secondary">
				<SvgIcon fontSize="inherit">
					<svg className="svg active">
						{/*eslint-disable-next-line*/}
						<use href={sprite + "#cancel"} />
					</svg>
				</SvgIcon>
			</IconButton>}
		</div>
		<div><i>{props.comment.text === "" ?  "No text inserted" : props.comment.text}</i></div>
	</div>
	)
}

export default CommentChild;