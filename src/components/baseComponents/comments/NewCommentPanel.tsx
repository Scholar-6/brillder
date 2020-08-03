import React from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import { Grid, TextField, Box, Button } from '@material-ui/core';
import './NewCommentPanel.scss';

import { Brick } from 'model/brick';
import { ReduxCombinedState } from 'redux/reducers';
import comments from 'redux/actions/comments';

interface NewCommentPanelProps {
	currentBrick: Brick;
	collapsePanel(): void;
	createComment(comment: any): void;
}

const NewCommentPanel: React.FC<NewCommentPanelProps> = props => {
	const [text, setText] = React.useState("");

	const handlePostComment = () => {
		props.createComment({
			text,
			brickId: props.currentBrick.id
		});
		setText("");
		props.collapsePanel();
	}

	return (
	<Box bgcolor="white" clone>
		<Grid container direction="column" alignItems="stretch">
			<Grid item>
				<form style={{ padding: "20px" }}>
					<TextField label="Comment Text" value={text}
						onChange={(evt) => setText(evt.target.value)} multiline fullWidth variant="outlined" />
				</form>
			</Grid>
			<Grid item container direction="row">
				<Button className="comment-action-button post"onClick={() => handlePostComment()} disableElevation>POST</Button>
				<Button className="comment-action-button cancel" onClick={() => props.collapsePanel()} disableElevation>CANCEL</Button>
			</Grid>
		</Grid>
	</Box>
	);
};

const mapState = (state: ReduxCombinedState) => ({
	currentBrick: state.brick.brick
});

const mapDispatch = (dispatch: any) => ({
	createComment: (comment: any) => dispatch(comments.createComment(comment))
});

const connector = connect(mapState, mapDispatch)

export default connector(NewCommentPanel);