import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { PlayFilters } from '../../model';
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";
import { ClassroomApi } from "components/teach/service";

enum PlayFilterFields {
  Completed = 'completed',
  Submitted = 'submitted',
  Checked = 'checked'
}

interface FilterSidebarProps {
  filters: PlayFilters;
  assignmentsLength: number;
  assignments: AssignmentBrick[];
  classrooms: ClassroomApi[];
  activeClassroomId: number;
  filterChanged(filters: PlayFilters): void;
  setActiveClassroom(classroom: number): void;
}

interface FilterSidebarState {
  filterExpanded: boolean;
  isClearFilter: boolean;
}

class PlayFilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      filterExpanded: true,
      isClearFilter: false,
    }
  }

  hideFilter() { this.setState({ filterExpanded: false }) }
  expandFilter() { this.setState({ filterExpanded: true }) }

  filterClear(filters: PlayFilters) {
    if (filters.checked || filters.completed || filters.submitted) {
      this.setState({ isClearFilter: true });
    } else {
      this.setState({ isClearFilter: false });
    }
  }

  clearStatus() {
    const { filters } = this.props;
    filters.viewAll = true;
    filters.checked = false;
    filters.completed = false;
    filters.submitted = false;
    this.filterClear(filters);
    this.props.filterChanged(filters);
  }

  toggleFilter(filter: PlayFilterFields) {
    const { filters } = this.props;
    filters.viewAll = false;
    filters[filter] = !filters[filter];
    // if any selected then view all
    if (!filters.completed && !filters.submitted && !filters.checked) {
      filters.viewAll = true;
    }
    this.filterClear(filters);
    this.props.filterChanged(filters);
  }

  renderClassroomBox = (c: ClassroomApi, i: number) => {
    const {activeClassroomId} = this.props;

    return (
      <div className={`index-box ${activeClassroomId === c.id ? 'active' : ''}`} key={i} onClick={() => this.props.setActiveClassroom(c.id)}>
        {c.name}
        {c.assignmentsCount &&
          <div className="right-index">
            <div className="white-box">{c.assignmentsCount}</div>
          </div>
        }
      </div>
    )
  }

  renderIndexesBox = () => {
    const {activeClassroomId} = this.props;

    return (
      <div className="sort-box teach-sort-box play-index-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">INBOX</div>
        </div>
        <div className="filter-container indexes-box classrooms-filter">
          <div className={`index-box ${activeClassroomId > 0 ? '' : 'active'}`} onClick={() => this.props.setActiveClassroom(-1)}>
            View All
            <div className="right-index">
              <div className="white-box">{this.props.assignmentsLength}</div>
            </div>
          </div>
          {this.props.classrooms.map((c, i) => this.renderClassroomBox(c, i))}
        </div>
      </div>
    );
  };

  renderSortAndFilterBox = () => {
    const { filters } = this.props;

    let toBeCompletedCount = 0;
    let checkedCount = 0;

    for (const assignment of this.props.assignments) {
      if (assignment.status === AssignmentBrickStatus.ToBeCompleted) {
        toBeCompletedCount++;
      } else if (assignment.status === AssignmentBrickStatus.SubmitedToTeacher) {
      } else if (assignment.status === AssignmentBrickStatus.CheckedByTeacher) {
        checkedCount++;
      }
    }
    return (
      <div className="sort-box play-box">
        <div className="filter-header">
          Filter
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
                checked={filters.completed}
                control={
                  <Radio onClick={() => this.toggleFilter(PlayFilterFields.Completed)} className={"filter-radio custom-color"} />
                }
                label="To be completed" />
              <div className="right-index">{toBeCompletedCount}</div>
            </div>
            <div className="index-box color4">
              <FormControlLabel
                checked={filters.checked}
                control={
                  <Radio onClick={() => this.toggleFilter(PlayFilterFields.Checked)} className={"filter-radio custom-color"} />
                }
                label="Completed" />
              <div className="right-index">{checkedCount}</div>
            </div>
          </div>
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
