import React from 'react';
import { Grid, Box, SvgIcon } from '@material-ui/core';

import sprite from "assets/img/icons-sprite.svg";
import { withStyles } from '@material-ui/styles';

import { CommentChildProps } from './CommentChild';

import moment from 'moment';

interface CommentItemProps {
    text: string;
    timestamp: Date;
}

const Stretch = withStyles({
    root: {
        flexGrow: 1
    }
})(Grid);

const CommentItem: React.FC<CommentItemProps> = props => {
    return (
    <Grid item>
        <Box marginX={2} marginY={2} padding={2} borderRadius={15} bgcolor="#ffffff">
            <Grid container direction="column">
                <Grid item container direction="row">
                    <Stretch item>
                        <h4><b>Editor</b></h4>
                    </Stretch>
                    <SvgIcon>
                        <svg className="svg active">
                            {/*eslint-disable-next-line*/}
                            <use href={sprite + "#cancel"} />
                        </svg>
                    </SvgIcon>
                    <SvgIcon>
                        <svg className="svg active">
                            {/*eslint-disable-next-line*/}
                            <use href={sprite + "#ok"} />
                        </svg>
                    </SvgIcon>
                </Grid>
                <Grid item>
                    <h5 style={{ marginBottom: "10px" }}>{moment(props.timestamp).format("H:mm D MMM")}</h5>
                </Grid>
                <Grid item>
                    <b>Comment: </b><i>{props.text}</i>
                </Grid>
                {props.children && props.children instanceof Array && props.children.length != 0 &&
                <Box borderTop="1px solid lightgrey" paddingTop={1} marginTop={1} clone>
                    <Grid item container direction="column">
                        {props.children}
                    </Grid>
                </Box>}
            </Grid>
        </Box>
    </Grid>
    )
};

export default CommentItem;