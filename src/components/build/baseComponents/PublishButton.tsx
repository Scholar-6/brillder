import React from "react";
import { connect } from "react-redux";

import brickActions from 'redux/actions/brickActions';

import SpriteIcon from "components/baseComponents/SpriteIcon";
import { Brick } from "model/brick";
import ReturnToEditorDialog from "./dialogs/ReturnToEditorDialog";
import map from "components/map";

export interface ButtonProps {
  history: any;
  brick: Brick;

  // redux
  returnToEditors(brick: Brick): Promise<void>;
}

const PublishButton: React.FC<ButtonProps> = props => {
  const [isOpen, setState] = React.useState(false);

  return (
    <div>
      <div className="build-publish-button" onClick={() => setState(true)}>
        <SpriteIcon name="award" />
      </div>
      <ReturnToEditorDialog isOpen={isOpen} close={() => setState(false)} submit={async () => {
        await props.returnToEditors(props.brick);
        props.history.push(map.BackToWorkBuildTab);
      }} />
    </div>
  );
};

const mapDispatch = (dispatch: any) => ({
  returnToEditors: (brick: Brick) => dispatch(brickActions.assignEditor(brick)),
});

export default connect(null, mapDispatch)(PublishButton);
