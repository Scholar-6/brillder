import React from "react";
import { connect } from "react-redux";

import brickActions from 'redux/actions/brickActions';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Brick } from "model/brick";
import ReturnToEditorDialog from "./dialogs/ReturnToEditorDialog";
import map from "components/map";
import ReturnEditorsSuccessDialog from "components/play/finalStep/dialogs/ReturnEditorsSuccessDialog";

export interface ButtonProps {
  disabled: boolean;
  history: any;
  brick: Brick;

  // redux
  returnToEditors(brick: Brick): Promise<void>;
}

const ReturnToEditorButton: React.FC<ButtonProps> = props => {
  const [isOpen, setState] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  let className = 'return-to-editor-button';
  if (props.disabled) {
    className += ' disabled';
  }

  return (
    <div>
      <div className={className} onClick={() => {
        if (!props.disabled) {
          setState(true);
        }
      }}>
        <SpriteIcon name="repeat" />
      </div>
      <ReturnToEditorDialog isOpen={isOpen} close={() => setState(false)} submit={async () => {
        await props.returnToEditors(props.brick);
        setState(false);
        setSuccess(true);
      }} />
      <ReturnEditorsSuccessDialog
        isOpen={success}
        editors={props.brick.editors}
        close={() => {
          setSuccess(false);
          props.history.push(map.BackToWorkBuildTab);
        }}
      />
    </div>
  );
};

const mapDispatch = (dispatch: any) => ({
  returnToEditors: (brick: Brick) => dispatch(brickActions.assignEditor(brick)),
});

export default connect(null, mapDispatch)(ReturnToEditorButton);
