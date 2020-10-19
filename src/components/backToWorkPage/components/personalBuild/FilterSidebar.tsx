import React, { Component } from "react";
import { Grid } from "@material-ui/core";

interface FilterSidebarProps {
}
interface FilterSidebarState {
}

class FilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  renderIndexesBox() {
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">INBOX</div>
        </div>
        <div className="filter-container indexes-box">
        <div className={"index-box " + (true ? "active" : "")}
            onClick={()=>{}}>
            View All
  					<div className="right-index">{0}</div>
          </div>
        </div>
      </div>
    );
  }

  renderSortAndFilterBox = () => {
    return (
      <div className="sort-box">
        <div className="filter-header" style={{marginTop: '5vh', marginBottom: '3vh'}}>
          <span>FILTER</span>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        {this.renderIndexesBox()}
        {this.renderSortAndFilterBox()}
      </Grid>
    );
  }
}

export default FilterSidebar;
