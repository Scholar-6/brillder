import React from 'react';
// @ts-ignore
import { connect } from 'react-redux';
import { Grid, TextField, Box, Button } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import { blue, red } from '@material-ui/core/colors';
//import { Comment } from 'model/comments';
import { Brick } from 'model/brick';
import { ReduxCombinedState } from 'redux/reducers';
import comments from 'redux/actions/comments';

const PostButton = withStyles({
	root: {
		color: "#ffffff",
		backgroundColor: blue[500],
		'&:hover': {
			backgroundColor: blue[700],
		},
		flexBasis: "50%",
		flexShrink: 1,
		fontSize: 25,
		letterSpacing: 7,
		borderRadius: 0
	}
})(Button);

const CancelButton = withStyles({
	root: {
		color: "#ffffff",
		backgroundColor: red[500],
		'&:hover': {
			backgroundColor: red[700],
		},
		fontSize: 25,
		flexBasis: "50%",
		flexShrink: 1,
		letterSpacing: 7,
		borderRadius: 0
	}
})(Button);

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
				<PostButton onClick={() => handlePostComment()} disableElevation>POST</PostButton>
				<CancelButton onClick={() => props.collapsePanel()} disableElevation>CANCEL</CancelButton>
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