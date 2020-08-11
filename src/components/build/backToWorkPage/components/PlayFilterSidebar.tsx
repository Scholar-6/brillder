import React, { Component } from "react";
import { Grid, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { Brick, BrickStatus } from "model/brick";
import { SortBy, Filters } from '../model';


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

class PlayFilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
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
        <div className="filter-container sort-by-box" style={{paddingTop: '4vh', paddingBottom: '0.5vh'}}>
          <div className="sort-header">INBOX</div>
        </div>
        <div className="filter-container indexes-box">
          <div className={"index-box " + (this.props.filters.viewAll ? "active" : "")}
            onClick={() => this.props.showAll()}>
            View All
					<div className="right-index">{0}</div>
          </div>
        </div>
        <div style={{height: '31vh'}}></div>
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
        <div className="filter-header">Filter</div>
        {this.state.filterExpanded === true ? (
          <div className="filter-container subject-indexes-box" style={{marginTop: '5vh'}}>
            <div className="index-box color1">
              <FormControlLabel
                checked={this.props.filters.draft}
                control={<Radio onClick={() => this.props.toggleDraftFilter()} className={"filter-radio custom-color"} />}
                label="To be completed" />
              <div className="right-index">{0}</div>
            </div>
            <div className="index-box color2">
              <FormControlLabel
                checked={this.props.filters.review}
                control={<Radio onClick={() => this.props.toggleReviewFilter()} className={"filter-radio custom-color"} />}
                label="Submitted to Teacher" />
              <div className="right-index">{0}</div>
            </div>
            <div className="index-box color4">
              <FormControlLabel
                checked={this.props.filters.publish}
                control={<Radio onClick={e => this.props.togglePublishFilter(e)} className={"filter-radio custom-color"} />}
                label="Checked by Teacher" />
              <div className="right-index">{0}</div>
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

export default PlayFilterSidebar;
