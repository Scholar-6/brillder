import React from "react";
import Dialog from '@material-ui/core/Dialog';
import { Grid, Button } from "@material-ui/core";

interface DesktopVersionProps {
  history: any;
}

const DesktopVersionDialog:React.FC<DesktopVersionProps> = (props) => {
  return (
    <Dialog open={true} className="dialog-box">
      <div className="dialog-header">
        <div>You need desktop browser to use this page</div>
      </div>
      <Grid container direction="row" className="dialog-footer" justify="center">
        <Button className="yes-button" onClick={() => props.history.push('/home')}>
          Move
        </Button>
      </Grid>
    </Dialog>
  );
}

export default DesktopVersionDialog;
