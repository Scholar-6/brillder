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

interface Filters {

}


interface FilterSidebarProps {
  isLoaded: boolean;
  sortBy: PSortBy;
  setSort(sort: PSortBy): void;
  dateFilter: PDateFilter;
  setDateFilter(filter: PDateFilter): void;
  filterChanged(filters: Filters): void;
}

interface FilterSidebarState {
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
    const { sortBy, dateFilter } = this.props;
    return (
      <Grid
        container item xs={3}
        className="sort-and-filter-container teach-assigned"
      >
        <div className="sort-box">
          <div className="bold font1-5">Sort By</div>
          <div className="sort-radio-btns">
            <FormControlLabel
              checked={sortBy === PSortBy.MostPlayed}
              control={<Radio onClick={() => this.props.setSort(PSortBy.MostPlayed)} className={"filter-radio custom-color"} />}
              label="Most Played" />
            <FormControlLabel
              checked={sortBy === PSortBy.LeastPlayed}
              control={<Radio onClick={() => this.props.setSort(PSortBy.LeastPlayed)} className={"filter-radio custom-color"} />}
              label="Least Played" />
          </div>
        </div>
        <div className="filter-header">Date Filter</div>
        <div className="sort-radio-btns filter-row margin-smaller top-margin-bigger">
          <FormControlLabel
            checked={dateFilter === PDateFilter.Today}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.Today)} className={"filter-radio custom-color"} />}
            label="Today" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={dateFilter === PDateFilter.Past3Days}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.Past3Days)} className={"filter-radio custom-color"} />}
            label="Past 3 days" />
          <FormControlLabel
            checked={dateFilter === PDateFilter.PastWeek}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.PastWeek)} className={"filter-radio custom-color"} />}
            label="Past week" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={dateFilter === PDateFilter.PastMonth}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.PastMonth)} className={"filter-radio custom-color"} />}
            label="Past month" />
          <FormControlLabel
            checked={dateFilter === PDateFilter.AllTime}
            control={<Radio onClick={() => this.props.setDateFilter(PDateFilter.AllTime)} className={"filter-radio custom-color"} />}
            label="All time" />
        </div>
        <div className="filter-header">Category</div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={sortBy === PSortBy.MostPlayed}
            control={<Radio onClick={() => { }} className={"filter-radio custom-color"} />}
            label="Everything" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={sortBy === PSortBy.LeastPlayed}
            control={<Radio onClick={() => { }} className={"filter-radio custom-color"} />}
            label="STEM" />
          <FormControlLabel
            checked={sortBy === PSortBy.LeastPlayed}
            control={<Radio onClick={() => { }} className={"filter-radio custom-color"} />}
            label="Humanities" />
        </div>
        <div className="sort-radio-btns filter-row margin-smaller">
          <FormControlLabel
            checked={sortBy === PSortBy.LeastPlayed}
            control={<Radio onClick={() => { }} className={"filter-radio custom-color"} />}
            label="General & Topical" />
          <FormControlLabel
            checked={sortBy === PSortBy.LeastPlayed}
            control={<Radio onClick={() => { }} className={"filter-radio custom-color"} />}
            label="Other" />
        </div>
        <div className="filter-header">Subjects</div>
        <div></div>
        {this.renderContent()}
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default BricksPlayedSidebar;
