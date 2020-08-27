import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { connect } from 'react-redux';

import "./FailedRequestDialog.scss";
import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/requestFailed';

interface DeleteDialogProps {
  failed: boolean;
  error: string;
  forgetFailture(): void;
}

const FailedRequestDialog: React.FC<DeleteDialogProps> = (props) => {
  return (
    <Dialog open={props.failed} onClose={props.forgetFailture} className="dialog-box">
      <div className="dialog-header">
        <div>Sorry, we've run into a brick wall. Click refresh and see if we can get over it.</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button"
          onClick={props.forgetFailture}>
          <span>Close</span>
        </button>
      </div>
    </Dialog>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  failed: state.requestFailed.failed,
  error: state.requestFailed.error,
});

const mapDispatch = (dispatch: any) => ({
  forgetFailture: () => dispatch(actions.forgetFailture()),
});

const connector = connect(mapState, mapDispatch);

export default connector(FailedRequestDialog);
