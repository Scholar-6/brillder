import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { connect } from 'react-redux';
import Avatar from "@material-ui/core/Avatar";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import SpriteIcon from "components/baseComponents/SpriteIcon";

import "./FailedRequestDialog.scss";
import { ReduxCombinedState } from 'redux/reducers';
import actions from 'redux/actions/requestFailed';

interface FailedRequestProps {
  failed: boolean;
  error: string;
  forgetFailture(): void;
}

const FailedRequestDialog: React.FC<FailedRequestProps> = props => {
  return (
    <Dialog
      open={props.failed}
      onClick={props.forgetFailture}
      onClose={props.forgetFailture}
      className="dialog-box link-copied-dialog"
    >
      <div className="dialog-header">
        <div>
          <Avatar className="circle-check bg-theme-orange">
            <SpriteIcon name="alert-triangle" className="active text-white stroke-2" />
          </Avatar>
        </div>
        <div>
          <span className="bold">Sorry, we've run into a brick wall</span>
          <span className="italic">Click refresh and see if we can get over it</span>
        </div>
      </div>
    </Dialog>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  failed: state.requestFailed.failed,
  error: state.requestFailed.error,
});

const mapDispatch = (dispatch: any) => ({
  forgetFailture: () => dispatch(actions.forgetFailture()),
});

const connector = connect(mapState, mapDispatch);

export default connector(FailedRequestDialog);
