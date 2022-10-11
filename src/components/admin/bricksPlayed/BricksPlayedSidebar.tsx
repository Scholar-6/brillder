import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

export enum PSortBy {
  MostPlayed,
  LeastPlayed
}

export enum PDateFilter {
  Today,
  Past3Days,
  PastWeek,
  PastMonth,
  AllTime
}

export enum PDateFilter {
  
}

interface Filters {

}


interface FilterSidebarProps {
  isLoaded: boolean;
  filterChanged(filters: Filters): void;
}

interface FilterSidebarState {
  sortBy: PSortBy;
  dateFilter: PDateFilter;
  filters: Filters;
}

export enum SortClassroom {
  Name,
  Date,
  Assignment
}

class BricksPlayedSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      sortBy: PSortBy.MostPlayed,
      dateFilter: PDateFilter.Today,
      filters: {
        assigned: false,
        completed: false,
      },
    };
  }

  renderContent() {
    if (!this.props.isLoaded) {
      return <div></div>;
    }
    return <div></div>;
  }

  render() {
    return (
      <Grid
        container item xs={3}
        className="sort-and-filter-container teach-assigned"
      >
        <div className="sort-box">
          <div className="bold font1-5">Sort By</div>
          <div className="sort-radio-btns">
            <FormControlLabel
              checked={this.state.sortBy === PSortBy.MostPlayed}
              control={<Radio onClick={() => this.setState({ sortBy: PSortBy.MostPlayed })} className={"filter-radio custom-color"} />}
              label="Most Played" />
            <FormControlLabel
              checked={this.state.sortBy === PSortBy.LeastPlayed}
              control={<Radio onClick={() => this.setState({ sortBy: PSortBy.LeastPlayed })} className={"filter-radio custom-color"} />}
              label="Least Played" />
          </div>
        </div>
        <div className="filter-header">Date Filter</div>
        <div className="sort-radio-btns filter-row margin-smaller top-margin-bigger">
          <FormControlLabel
            checked={this.state.dateFilter === PDateFilter.Today}
            control={<Radio onClick={() => this.setState({ dateFilter: PDateFilter.Today })} className={"filter-radio custom-color"} />}
            label="Today" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={this.state.dateFilter === PDateFilter.Past3Days}
            control={<Radio onClick={() => this.setState({ dateFilter: PDateFilter.Past3Days })} className={"filter-radio custom-color"} />}
            label="Past 3 days" />
          <FormControlLabel
            checked={this.state.dateFilter === PDateFilter.PastWeek}
            control={<Radio onClick={() => this.setState({ dateFilter: PDateFilter.PastWeek })} className={"filter-radio custom-color"} />}
            label="Past week" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller"> 
          <FormControlLabel
            checked={this.state.dateFilter === PDateFilter.PastMonth}
            control={<Radio onClick={() => this.setState({ dateFilter: PDateFilter.PastMonth })} className={"filter-radio custom-color"} />}
            label="Past month" />
          <FormControlLabel
            checked={this.state.dateFilter === PDateFilter.AllTime}
            control={<Radio onClick={() => this.setState({ dateFilter: PDateFilter.AllTime })} className={"filter-radio custom-color"} />}
            label="All time" />
        </div>
        <div className="filter-header">Category</div>
        <div className="sort-radio-btns filter-row margin-smaller"> 
          <FormControlLabel
            checked={this.state.sortBy === PSortBy.MostPlayed}
            control={<Radio onClick={() => this.setState({ sortBy: PSortBy.MostPlayed })} className={"filter-radio custom-color"} />}
            label="Past month" />
          <FormControlLabel
            checked={this.state.sortBy === PSortBy.LeastPlayed}
            control={<Radio onClick={() => this.setState({ sortBy: PSortBy.LeastPlayed })} className={"filter-radio custom-color"} />}
            label="All time" />
        </div>
        {this.renderContent()}
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default BricksPlayedSidebar;
