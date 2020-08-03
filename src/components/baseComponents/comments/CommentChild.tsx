import React from 'react';
import { Comment } from 'model/comments';
import moment from 'moment';

export interface CommentChildProps {
	comment: Comment
}

const CommentChild: React.FC<CommentChildProps> = props => {
	return (
	<div className="comment-child-container">
		<div className="comment-head-bar">
			<b className="comment-author">{props.comment.author.firstName} {props.comment.author.lastName}</b>
			<small>{moment(props.comment.timestamp).format("H:mm D MMM")}</small>
		</div>
		<div><i>{props.comment.text === "" ?  "No text inserted" : props.comment.text}</i></div>
	</div>
	)
}

export default CommentChild;