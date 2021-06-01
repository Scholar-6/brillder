import React from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

import brickActions from "redux/actions/brickActions";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import map from "components/map";
import { clearProposal } from "localStorage/proposal";

interface Props {
  history: any;
  forgetBrick(): void;
}

const EmptyFilterSidebar:React.FC<Props> = props => {
  return (
    <Grid container item xs={3} className="sort-and-filter-container">
      <div className="filter-create-button-container">
         <div className="back-hover-area back-hover-area-filter" onClick={() => {
           clearProposal();
           props.forgetBrick();
           props.history.push(map.ProposalStart);
         }}>
            <div className="create-icon svgOnHover">
              <SpriteIcon name="trowel" className="w100 h100 active" />
            </div>
            <div className="text-container">
              Create A New Brick
              <div>
                <SpriteIcon name="arrow-right" />
              </div>
            </div>
          </div>
      </div>
    </Grid>
  );
}

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
});

export default connect(null, mapDispatch)(EmptyFilterSidebar);
