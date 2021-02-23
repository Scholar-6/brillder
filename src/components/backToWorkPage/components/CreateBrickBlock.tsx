import React from "react";
import { connect } from "react-redux";

import map from "components/map";
import actions from 'redux/actions/brickActions';
import { clearProposal } from "localStorage/proposal";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface BlockProps {
  history: any;
  isCore: boolean;
  forgetBrick(): void;
}

const CreateBrickBlock:React.FC<BlockProps> = props => {
  return (
    <div className="main-brick-container create-link" key={-32} onClick={() => {
      clearProposal();
      props.forgetBrick();
      props.history.push(map.ProposalBase + '?isCore=' + props.isCore);
    }}>
      <SpriteIcon name="trowel" />
      <span>Create A New Brick</span>
    </div>
  );
}

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(actions.forgetBrick())
});

export default connect(null, mapDispatch)(CreateBrickBlock);
