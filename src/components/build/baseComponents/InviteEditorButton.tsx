import React, { useState } from "react";
import { connect } from "react-redux";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { ReduxCombinedState } from "redux/reducers";
import InviteEditorDialog from "components/playPreview/finalStep/InviteEditorDialog";
import brickActions from 'redux/actions/brickActions';
import { Brick } from "model/brick";
import InvitationSuccessDialog from "components/play/finalStep/dialogs/InvitationSuccessDialog";
import map from "components/map";

interface InviteResult {
  isOpen: boolean;
  accessGranted: boolean;
  name: string;
}

export interface ButtonProps {
  disabled: boolean;
  isAuthor: boolean;
  brick: Brick;
  history: any;

  fetchBrick(brickId: number): void;
}

const InviteEditorButton: React.FC<ButtonProps> = props => {
  const [hovered, setHover] = useState(false);
  const [inviteOpen, setOpen] = useState(false);

  const [inviteResult, setInviteResult] = useState({
    isOpen: false,
    accessGranted: false,
    name: ''
  } as InviteResult);

  let className = 'return-to-editor-button invite-editor-button';
  if (props.disabled) {
    className += ' disabled';
  } else {
    className += ' active';
  }
  return (
    <div className="return-to-editor-button-container">
      <div className={`custom-hover-container ${hovered ? 'hovered' : ''}`}></div>
      <div
        className={className}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(true)}
      >
        <SpriteIcon name="user-plus" />
        {hovered && <div className="custom-tooltip">Invite an Editor</div>}
      </div>
      <InviteEditorDialog
        canEdit={true} brick={props.brick} isOpen={inviteOpen} hideAccess={true}
        submit={name => {
          setInviteResult({ isOpen: true, name, accessGranted: true } as InviteResult);
          props.fetchBrick(props.brick.id);
        }}
        close={() => setOpen(false)}
      />
      <InvitationSuccessDialog
        isAuthor={props.isAuthor}
        isOpen={inviteResult.isOpen} name={inviteResult.name} accessGranted={inviteResult.accessGranted}
        close={() => {
          setInviteResult({ isOpen: false, name: '', accessGranted: false } as InviteResult)
          props.history.push(map.MainPage);
      }}
      />
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
});

const mapDispatch = (dispatch: any) => ({
  fetchBrick: (brickId: number) => dispatch(brickActions.fetchBrick(brickId)),
});

export default connect(mapState, mapDispatch)(InviteEditorButton);
