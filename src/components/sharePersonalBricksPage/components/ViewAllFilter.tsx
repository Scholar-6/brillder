import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import SpriteIcon from "components/baseComponents/SpriteIcon";


export enum SortBy {
  None,
  Date,
  Popularity,
}

interface FilterProps {
  selectedCount: number;
  share(): void;
}

interface FilterState {
}

class ViewAllFilterComponent extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
  }

  render() {
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        <div className="flex-height-box">
          <div className="bold title-box-r1">
            Share your personal bricks
          </div>
          <div className="text-box-r1">
            Select multiple bricks to share with students or peers
          </div>
          <div className="share-box-r1">
            <div className="text-r1">{this.props.selectedCount} Bricks Selected</div>
            <div className="share-btn-r1" onClick={this.props.share}>
              <SpriteIcon name="share-white-filled" />
              Share
            </div>
          </div>
        </div>
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default ViewAllFilterComponent;
