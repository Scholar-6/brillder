import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { Brick, BrickStatus } from "model/brick";
import { SortBy, Filters } from '../BackToWork';


interface FilterSidebarProps {
  rawBricks: Brick[];
  filters: Filters;
  sortBy: SortBy;
  isClearFilter: boolean;
  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  clearStatus(): void;
  toggleDraftFilter(): void;
  toggleReviewFilter(): void;
  togglePublishFilter(e: React.ChangeEvent<any>): void;
  showAll(): void;
  showBuildAll(): void;
  showEditAll(): void;
}
interface FilterSidebarState {
  filterExpanded: boolean;
}

class FilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = { filterExpanded: true }
  }
  hideFilter() {
    this.setState({ ...this.state, filterExpanded: false });
  }
  expandFilter() {
    this.setState({ ...this.state, filterExpanded: true });
  }

  renderIndexesBox = () => {
    let build = 0;
    let edit = 0;
    for (let b of this.props.rawBricks) {
      if (b.status === BrickStatus.Draft) {
        build += 1;
      }
    }

    for (let b of this.props.rawBricks) {
      if (b.status !== BrickStatus.Draft) {
        edit += 1;
      }
    }
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">INBOX</div>
        </div>
        <div className="filter-container indexes-box">
          <div className={"index-box " + (this.props.filters.viewAll ? "active" : "")}
            onClick={() => this.props.showAll()}>
            View All
					<div className="right-index">{this.props.rawBricks.length}</div>
          </div>
          <div className={"index-box " + (this.props.filters.buildAll ? "active" : "")}
            onClick={() => this.props.showBuildAll()}>
            Build
					<div className="right-index">{build}</div>
          </div>
          <div className={"index-box " + (this.props.filters.editAll ? "active" : "")}
            onClick={() => this.props.showEditAll()}>
            Edit
					<div className="right-index">{edit}</div>
          </div>
        </div>
      </div>
    );
  };

  renderSortAndFilterBox = () => {
    let draft = 0;
    let review = 0;
    let publish = 0;

    for (let b of this.props.rawBricks) {
      if (b.status === BrickStatus.Draft) {
        draft += 1;
      }
    }

    for (let b of this.props.rawBricks) {
      if (b.status === BrickStatus.Review) {
        review += 1;
      }
    }

    for (let b of this.props.rawBricks) {
      if (b.status === BrickStatus.Publish) {
        publish += 1;
      }
    }

    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">SORT BY</div>
          <RadioGroup className="sort-group"
            aria-label="SortBy"
            name="SortBy"
            value={this.props.sortBy}
            onChange={this.props.handleSortChange}>
            <Grid container direction="row">
              <Grid item xs={4}>
                <FormControlLabel
                  value={SortBy.Status}
                  control={<Radio className="sortBy" />}
                  label="Status" />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  value={SortBy.Popularity}
                  control={<Radio className="sortBy" />}
                  label="Popularity" />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  value={SortBy.Date}
                  control={<Radio className="sortBy" />}
                  label="Last Edit" />
              </Grid>
            </Grid>
          </RadioGroup>
        </div>
        <div className="filter-header">
          <span>Filter</span>
          <button className={"btn-transparent filter-icon " + (this.state.filterExpanded ? this.props.isClearFilter ? ("arrow-cancel") : ("arrow-down") : ("arrow-up"))}
            onClick={() => {
              this.state.filterExpanded
                ? this.props.isClearFilter
                  ? this.props.clearStatus()
                  : (this.hideFilter())
                : (this.expandFilter())
            }}>
          </button>
        </div>
        {this.state.filterExpanded === true ? (
          <div className="filter-container subject-indexes-box">
            <div className="index-box color1">
              <FormControlLabel
                checked={this.props.filters.draft}
                control={<Radio onClick={() => this.props.toggleDraftFilter()} className={"filter-radio custom-color"} />}
                label="Draft" />
              <div className="right-index">{draft}</div>
            </div>
            <div className="index-box color2">
              <FormControlLabel
                checked={this.props.filters.review}
                control={<Radio onClick={() => this.props.toggleReviewFilter()} className={"filter-radio custom-color"} />}
                label="Submitted for Review" />
              <div className="right-index">{review}</div>
            </div>
            <div className="index-box color4">
              <FormControlLabel
                checked={this.props.filters.publish}
                control={<Radio onClick={e => this.props.togglePublishFilter(e)} className={"filter-radio custom-color"} />}
                label="Published" />
              <div className="right-index">{publish}</div>
            </div>
          </div>
        ) : (
            ""
          )}
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
