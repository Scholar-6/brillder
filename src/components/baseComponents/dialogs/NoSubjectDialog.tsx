import React from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from "redux/actions/user";
import brickActions from "redux/actions/brickActions";
import { clearProposal } from "localStorage/proposal";
import BaseDialogWrapper from "./BaseDialogWrapper";
import { updateUser } from 'services/axios/user';
import { Subject } from "model/brick";
import { User } from "model/user";
import map from "components/map";

interface DialogProps {
  isOpen: boolean;
  history: any;
  subject: Subject;
  close(): void;

  user: User;
  forgetBrick(): Promise<void>;
  getUser(): Promise<void>;
}

const NoSubjectDialog: React.FC<DialogProps> = (props) => {
  const submit = async () => {
    const {user} = props;
    let updatedUser = Object.assign({}, props.user);
    if (user.subjects) {
      updatedUser.subjects = user.subjects.map((s) => s.id);
    }

    updatedUser.roles = null as any;
    updatedUser.subjects.push(props.subject.id);

    await props.forgetBrick();
    clearProposal();

    await updateUser(updatedUser);
    await props.getUser();

    props.history.push(map.ProposalSubjectLink + '?selectedSubject=' + props.subject.id);
    props.close();
  }
  return (
    <BaseDialogWrapper open={props.isOpen} close={props.close} submit={submit}>
      <div className="dialog-header">
        <div><span className="bold">{props.subject.name}</span> is not listed as one of your subjects yet.<br />Would you like to add it?</div>
      </div>
      <div className="dialog-footer">
        <button className="btn btn-md bg-theme-orange yes-button" onClick={submit}>
          <span>Yes, and start building</span>
        </button>
        <button className="btn btn-md bg-gray no-button" onClick={props.close}>
          <span>No</span>
        </button>
      </div>
    </BaseDialogWrapper>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  getUser: () => dispatch(actions.getUser()),
  forgetBrick: () => dispatch(brickActions.forgetBrick())
});

export default connect(mapState, mapDispatch)(NoSubjectDialog);
