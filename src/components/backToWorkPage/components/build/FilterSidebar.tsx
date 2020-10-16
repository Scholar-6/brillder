import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { Brick, BrickStatus } from "model/brick";
import { SortBy, Filters, ThreeColumns } from '../../model';
import { clearStatusFilters } from '../../service';


enum FilterFields {
  Draft = 'draft',
  Build = 'build',
  Review = 'review',
  Publish = 'publish'
}

interface FilterSidebarProps {
  finalBricks: Brick[];
  threeColumns: ThreeColumns;
  filters: Filters;
  sortBy: SortBy;
  handleSortChange(e: React.ChangeEvent<HTMLInputElement>): void;
  showAll(): void;
  showBuildAll(): void;
  showEditAll(): void;
  filterChanged(filters: Filters): void;
}
interface FilterSidebarState {
  filterExpanded: boolean;
  isClearFilter: boolean;
}

class FilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      filterExpanded: true,
      isClearFilter: false,
    }
  }

  hideFilter() { this.setState({ filterExpanded: false }) }
  expandFilter() { this.setState({ filterExpanded: true }) }

  toggleFilter(filter: FilterFields) {
    const { filters } = this.props;
    filters[filter] = !filters[filter];
    this.filterClear();
    this.props.filterChanged(filters);
  }

  clearStatus() {
    const { filters } = this.props;
    clearStatusFilters(filters);
    this.filterClear();
    this.props.filterChanged(filters);
  }

  filterClear() {
    let { draft, review, build } = this.props.filters
    if (draft || review || build) {
      this.setState({ isClearFilter: true })
    } else {
      this.setState({ isClearFilter: false })
    }
  }

  renderIndexesBox = (viewAll: number, build: number, edit: number) => {
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">INBOX</div>
        </div>
        <div className="filter-container indexes-box">
          <div className={"index-box " + (this.props.filters.viewAll ? "active" : "")}
            onClick={this.props.showAll}>
            View All
					<div className="right-index">{viewAll}</div>
          </div>
          <div className={"index-box " + (this.props.filters.buildAll ? "active" : "")}
            onClick={this.props.showBuildAll}>
            Build
					<div className="right-index">{build}</div>
          </div>
          <div className={"index-box " + (this.props.filters.editAll ? "active" : "")}
            onClick={this.props.showEditAll}>
            Edit
					<div className="right-index">{edit}</div>
          </div>
        </div>
      </div>
    );
  };

  renderSortAndFilterBox = (draft: number, build: number, review: number) => {
    return (
      <div className="sort-box">
        <div className="filter-header" style={{marginTop: '5vh', marginBottom: '3vh'}}>
          <span>LIVE OVERVIEW</span>
          <button
            className={
              "btn-transparent filter-icon " +
              (this.state.filterExpanded
                ? this.state.isClearFilter
                  ? "arrow-cancel"
                  : "arrow-down"
                : "arrow-up")
            }
            onClick={() => {
              this.state.filterExpanded
                ? this.state.isClearFilter
                  ? this.clearStatus()
                  : (this.hideFilter())
                : (this.expandFilter())
            }}>
          </button>
        </div>
        {this.state.filterExpanded === true && (
          <div className="filter-container subject-indexes-box">
            <div className="index-box color1">
              <FormControlLabel
                checked={this.props.filters.draft}
                control={<Radio onClick={() => this.toggleFilter(FilterFields.Draft)} className={"filter-radio custom-color"} />}
                label="Draft" />
              <div className="right-index">{draft}</div>
            </div>
            <div className="index-box color2">
              <FormControlLabel
                checked={this.props.filters.build}
                control={<Radio onClick={() => this.toggleFilter(FilterFields.Build)} className={"filter-radio custom-color"} />}
                label="Submitted for Review" />
              <div className="right-index">{build}</div>
            </div>
            <div className="index-box color5">
              <FormControlLabel
                checked={this.props.filters.review}
                control={<Radio onClick={e => this.toggleFilter(FilterFields.Review)} className={"filter-radio custom-color"} />}
                label="Pending Publication" />
              <div className="right-index">{review}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    let draft = 0;
    let build = 0;
    let publication = 0;
    let viewAll = 0;

    const {threeColumns, finalBricks} = this.props;

    if (this.props.filters.viewAll) {
      draft = threeColumns.red.finalBricks.length;
      build = threeColumns.yellow.finalBricks.length;
      publication = threeColumns.green.finalBricks.length;
      viewAll = draft + build + publication;
    } else {
      for (let b of finalBricks) {
        if (b.status === BrickStatus.Draft) {
          draft += 1;
        } else if (b.status === BrickStatus.Build) {
          build += 1;
        } else if (b.status === BrickStatus.Review) {
          publication += 1;
        }
      }
      viewAll = draft + build + publication;
    }

    if (this.props.filters.publish) {
      for (let b of finalBricks) {
        if (b.status === BrickStatus.Publish) {
          viewAll += 1;
        }
      }
    }

    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        {this.renderIndexesBox(viewAll, draft + build, draft)}
        {!this.props.filters.publish && this.renderSortAndFilterBox(draft, build, publication)}
      </Grid>
    );
  }
}

export default FilterSidebar;
