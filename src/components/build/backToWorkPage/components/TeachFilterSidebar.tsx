import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { Classroom } from "model/classroom";
import { Brick } from "model/brick";
import { SortBy, Filters } from '../model';
import sprite from "assets/img/icons-sprite.svg";

interface FilterSidebarProps {
  classrooms: Classroom[];
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
  activeClassroom: Classroom | null;
  filterExpanded: boolean;
}

class TeachFilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      activeClassroom: null,
      filterExpanded: true
    };
  }

  hideFilter() { this.setState({ ...this.state, filterExpanded: false }); }
  expandFilter() { this.setState({ ...this.state, filterExpanded: true }); }

  renderIndexesBox = () => {
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box" style={{ paddingTop: '4vh', paddingBottom: '0.5vh' }}>
          <div className="sort-header">CLASSES</div>
        </div>
        <div className="filter-container indexes-box classrooms-filter">
          <div className={"index-box " + (this.props.filters.viewAll ? "active" : "")}
            onClick={() => this.props.showAll()}>
            View All Classes
            <div className="right-index">
              {2}
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#users"} />
              </svg>
              <div className="white-box">
                {2}
              </div>
            </div>
          </div>
          {this.props.classrooms.map((c, i) => {
            return (
              <div
                className={"index-box " + (this.props.filters.viewAll ? "active" : "")}
                onClick={() => this.props.showAll()}
              >
                {c.name}
                <div className="right-index">
                  {c.students.length}
                  <svg className="svg active">
                    {/*eslint-disable-next-line*/}
                    <use href={sprite + "#users"} />
                  </svg>
                  <div className="white-box">
                    {2}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  renderSortAndFilterBox = () => {
    return (
      <div className="sort-box" style={{ marginTop: '1vh' }}>
        <div className="filter-header">Filter</div>
        {this.state.filterExpanded === true ? (
          <div className="filter-container subject-indexes-box" style={{ marginTop: '5vh' }}>
            <div className="index-box color1">
              <FormControlLabel
                checked={this.props.filters.draft}
                control={<Radio onClick={() => this.props.toggleDraftFilter()} className={"filter-radio custom-color"} />}
                label="Assigned to class or Student" />
              <div className="right-index">{0}</div>
            </div>
            <div className="index-box color2">
              <FormControlLabel
                checked={this.props.filters.review}
                control={<Radio onClick={() => this.props.toggleReviewFilter()} className={"filter-radio custom-color"} />}
                label="Submitted" />
              <div className="right-index">{0}</div>
            </div>
            <div className="index-box color4">
              <FormControlLabel
                checked={this.props.filters.publish}
                control={<Radio onClick={e => this.props.togglePublishFilter(e)} className={"filter-radio custom-color"} />}
                label="Completed" />
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

export default TeachFilterSidebar;
