import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { PlayFilters } from '../../model';
import { TeachClassroom } from "model/classroom";
import { AssignmentBrick, AssignmentBrickStatus } from "model/assignment";

enum PlayFilterFields {
  Completed = 'completed',
  Submitted = 'submitted',
  Checked = 'checked'
}

interface FilterSidebarProps {
  classrooms: TeachClassroom[];
  rawAssignments: AssignmentBrick[];
  filterChanged(filters: PlayFilters): void;
  setActiveClassroom(id: number | null): void;
}

interface FilterSidebarState {
  activeClassroom: TeachClassroom | null;
  filterExpanded: boolean;
  isClearFilter: boolean;
  filters: PlayFilters;
}

class PlayFilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      filterExpanded: true,
      isClearFilter: false,
      activeClassroom: null,
      filters: {
        completed: false,
        submitted: false,
        checked: false
      }
    }
  }

  hideFilter() { this.setState({ filterExpanded: false }) }
  expandFilter() { this.setState({ filterExpanded: true }) }

  filterClear(filters: PlayFilters) {
    if (filters.checked || filters.completed || filters.submitted) {
      this.setState({ isClearFilter: true, filters });
    } else {
      this.setState({ isClearFilter: false, filters });
    }
  }

  clearStatus() {
    const { filters } = this.state;
    filters.checked = false;
    filters.completed = false;
    filters.submitted = false;
    this.filterClear(filters);
    this.props.filterChanged(filters);
  }

  toggleFilter(filter: PlayFilterFields) {
    const { filters } = this.state;
    filters[filter] = !filters[filter];
    this.filterClear(filters);
    this.props.filterChanged(filters);
  }

  activateClassroom(activeClassroom: TeachClassroom) {
    const { classrooms } = this.props;
    for (let classroom of classrooms) {
      classroom.active = false;
    }
    activeClassroom.active = true;
    this.setState({ activeClassroom });
    this.props.setActiveClassroom(activeClassroom.id);
  }

  removeClassrooms() {
    const { classrooms } = this.props;
    for (let classroom of classrooms) {
      classroom.active = false;
    }
    this.setState({ activeClassroom: null });
    this.props.setActiveClassroom(null);
  }

  renderClassroom(c: TeachClassroom, i: number) {
    return (
      <div key={i} className="classes-box">
        <div className={"index-box " + (c.active ? "active" : "")} onClick={() => this.activateClassroom(c)}>
          <span className="classroom-name">{c.name}</span>
          <div className="right-index">
            <div className="white-box">{0}</div>
          </div>
        </div>
      </div>
    );
  }

  renderIndexesBox = () => {
    return (
      <div className="sort-box teach-sort-box">
        <div className="filter-container sort-by-box">
          <div className="sort-header">INBOX</div>
        </div>
        <div className="filter-container indexes-box classrooms-filter">
          <div
            className={"index-box " + (!this.state.activeClassroom ? "active" : "")}
            onClick={this.removeClassrooms.bind(this)}>
            View All
            <div className="right-index">
              <div className="white-box">{0}</div>
            </div>
          </div>
          {this.props.classrooms.map(this.renderClassroom.bind(this))}
        </div>
      </div>
    );
  };

  renderSortAndFilterBox = () => {
    const { filters } = this.state;

    let toBeCompletedCount = 0;
    let submittedCount = 0;
    let checkedCount = 0;

    for (const assignment of this.props.rawAssignments) {
      if (assignment.status === AssignmentBrickStatus.ToBeCompleted) {
        toBeCompletedCount++;
      } else if (assignment.status === AssignmentBrickStatus.SubmitedToTeacher) {
        submittedCount++;
      } else if (assignment.status === AssignmentBrickStatus.CheckedByTeacher) {
        checkedCount++;
      }
    }
    return (
      <div className="sort-box">
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
        {this.state.filterExpanded === true ? (
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
            <div className="index-box color2">
              <FormControlLabel
                checked={filters.submitted}
                control={
                  <Radio onClick={() => this.toggleFilter(PlayFilterFields.Submitted)} className={"filter-radio custom-color"} />
                }
                label="Submitted to Teacher" />
              <div className="right-index">{submittedCount}</div>
            </div>
            <div className="index-box color4">
              <FormControlLabel
                checked={filters.checked}
                control={
                  <Radio onClick={() => this.toggleFilter(PlayFilterFields.Checked)} className={"filter-radio custom-color"} />
                }
                label="Checked by Teacher" />
              <div className="right-index">{checkedCount}</div>
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
