import React from 'react';
import { Grid, TextField, Box } from '@material-ui/core';



const NewCommentPanel: React.FC = () => {
    return (
    <Box bgcolor="white" clone>
        <Grid container direction="column" alignItems="stretch">
            <Grid item>
                <form style={{ padding: "20px" }}>
                    <TextField label="Comment Text" multiline fullWidth variant="outlined" />
                </form>
            </Grid>
            <Grid item container direction="row">

            </Grid>
        </Grid>
    </Box>
    );
};

export default NewCommentPanel;