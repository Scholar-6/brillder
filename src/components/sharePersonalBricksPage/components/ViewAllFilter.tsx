import React, { Component } from "react";
import { Grid } from "@material-ui/core";


export enum SortBy {
  None,
  Date,
  Popularity,
}

interface FilterProps {
}

interface FilterState {
}

class ViewAllFilterComponent extends Component<FilterProps, FilterState> {
  constructor(props: FilterProps) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        <div className="flex-height-box">
          <div className="sort-box">
            Share your personal bricks
          </div>
          <div>
            Select multiple bricks to share with students or peers
          </div>
          <div>
          0 Bricks Selected
          </div>
        </div>
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default ViewAllFilterComponent;
