import React from 'react';
import { Grid, Box, SvgIcon, IconButton, Collapse } from '@material-ui/core';
//import { green, red } from '@material-ui/core/colors';
import { withStyles/*, createMuiTheme, ThemeProvider*/ } from '@material-ui/core/styles';

import sprite from "assets/img/icons-sprite.svg";

//import { CommentChildProps } from './CommentChild';

import moment from 'moment';
import ReplyCommentPanel from './ReplyCommentPanel';
import { Comment } from 'model/comments';

interface CommentItemProps {
  comment: Comment;
}

const Stretch = withStyles({
	root: {
		flexGrow: 1
	}
})(Grid);

/*
const GreenRedTheme = createMuiTheme({
	palette: {
		primary: green,
		secondary: red
	}
});
*/

const CommentItem: React.FC<CommentItemProps> = props => {
  const [replyPanelShown, setReplyPanelShown] = React.useState(false);

	return (
	<Grid item>
		<Box marginX={2} marginY={2} padding={2} borderRadius={15} bgcolor="#ffffff">
			<Grid container direction="column">
				<Grid item container direction="row">
					<Stretch item>
						<h4><b>{props.comment.author.firstName} {props.comment.author.lastName}</b></h4>
					</Stretch>
		      {/* Approve and Reject buttons 31/07/20
					<ThemeProvider theme={GreenRedTheme}>
						<IconButton aria-label="reply" size="small" color="primary">
							<SvgIcon fontSize="inherit">
				        <svg className="svg active">*/}
									{/*eslint-disable-next-line*/}
				          {/*
									<use href={sprite + "#ok"} />
								</svg>
							</SvgIcon>
						</IconButton>
						<IconButton aria-label="reply" size="small" color="secondary">
							<SvgIcon fontSize="inherit">
				<svg className="svg active">*/}
									{/*eslint-disable-next-line*/}
				          {/*
									<use href={sprite + "#cancel"} />
								</svg>
							</SvgIcon>
						</IconButton>
					</ThemeProvider>
		      */}
					<IconButton aria-label="reply" size="small" color="primary" onClick={() => setReplyPanelShown(!replyPanelShown)}>
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
				<Box borderTop="1px solid lightgrey" paddingTop={1} marginTop={1} clone>
					<Grid item container direction="column">
						{props.children}
					</Grid>
				</Box>}
		<Collapse in={replyPanelShown}>
		  <ReplyCommentPanel parentComment={props.comment} collapsePanel={() => setReplyPanelShown(false)} />
		</Collapse>
			</Grid>
		</Box>
	</Grid>
	)
};

export default CommentItem;