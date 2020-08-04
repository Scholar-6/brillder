import React from 'react';
import "./NewCommentPanel.scss";
// @ts-ignore
//import { connect } from 'react-redux';
import { Grid, /*TextField, Box,*/ Button, Input } from '@material-ui/core';


import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
//import { ReduxCombinedState } from 'redux/reducers';
//import comments from 'redux/actions/comments';

interface ReplyCommentPanelProps {
	parentComment: Comment;
	currentBrick: Brick;
	collapsePanel(): void;
	createComment(comment: any): void;
}

const ReplyCommentPanel: React.FC<ReplyCommentPanelProps> = props => {
	const [text, setText] = React.useState("");

	const handlePostComment = () => {
		props.createComment({
			text,
			brickId: props.currentBrick.id,
			parentId: props.parentComment.id
		});
		setText("");
		props.collapsePanel();
	}

	return (
	<Grid className="comment-reply-panel" container direction="column" alignItems="stretch">
		<Grid item>
			<form className="comment-reply-text-form">
				<Input placeholder="Add Reply..." value={text} multiline fullWidth disableUnderline
					onChange={(evt) => setText(evt.target.value)} />
			</form>
		</Grid>
		<Grid item container direction="row" justify="center">
			<Button className="comment-action-button reply post" onClick={() => handlePostComment()} disabled={text === ""}>POST</Button>
			<Button className="comment-action-button reply cancel" onClick={() => props.collapsePanel()} disabled={text === ""}>CANCEL</Button>
		</Grid>
	</Grid>
	);
};

export default ReplyCommentPanel;