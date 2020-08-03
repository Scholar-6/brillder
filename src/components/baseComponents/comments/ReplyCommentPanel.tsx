import React from 'react';
import "./NewCommentPanel.scss";
// @ts-ignore
import { connect } from 'react-redux';
import { Grid, TextField, Box, Button } from '@material-ui/core';


import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import { ReduxCombinedState } from 'redux/reducers';
import comments from 'redux/actions/comments';

interface ReplyCommentPanelProps {
	currentBrick: Brick;
	parentComment: Comment;
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
			<form style={{ padding: "5px" }}>
				<TextField label="Comment Text" value={text}
					onChange={(evt) => setText(evt.target.value)} multiline fullWidth variant="outlined" />
			</form>
		</Grid>
		<Grid item container direction="row">
			<Button className="comment-action-button reply post" onClick={() => handlePostComment()} disableElevation>POST</Button>
			<Button className="comment-action-button reply cancel" onClick={() => props.collapsePanel()} disableElevation>CANCEL</Button>
		</Grid>
	</Grid>
	);
};

const mapState = (state: ReduxCombinedState) => ({
	currentBrick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
	createComment: (comment: any) => dispatch(comments.createComment(comment))
});

const connector = connect(mapState, mapDispatch)

export default connector(ReplyCommentPanel);