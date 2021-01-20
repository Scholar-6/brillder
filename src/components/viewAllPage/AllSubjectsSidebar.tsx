
import React, { Component } from "react";
import { Grid } from "@material-ui/core";


interface FilterProps { }

class AllSubjectsSidebar extends Component<FilterProps> {
  render() {
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        <div className="unauthorized-sidebar">
          <div className="bold title">Select a Subject or View All</div>
        </div>
      </Grid>
    );
  }
}

export default AllSubjectsSidebar;
