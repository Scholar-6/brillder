import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { TeachClassroom } from "model/classroom";
import { TeachFilters } from '../../model';
import sprite from "assets/img/icons-sprite.svg";

enum TeachFilterFields {
  Assigned = 'assigned',
  Submitted = 'submitted',
  Completed = 'completed'
}

interface FilterSidebarProps {
  classrooms: TeachClassroom[];
  setActiveClassroom(id: number | null): void;
  filterChanged(filters: TeachFilters): void;
}

interface FilterSidebarState {
  activeClassroom: TeachClassroom | null;
  filterExpanded: boolean;
  filters: TeachFilters;
  isClearFilter: boolean;
}

class TeachFilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      activeClassroom: null,
      filterExpanded: true,
      isClearFilter: false,
      filters: {
        assigned: false,
        submitted: false,
        completed: false
      }
    };
  }

  hideFilter() { this.setState({ filterExpanded: false }) }
  expandFilter() { this.setState({ filterExpanded: true }) }

  clearStatus() {
    const { filters } = this.state;
    filters.assigned = false;
    filters.completed = false;
    filters.submitted = false;
    this.filterClear(filters);
    this.props.filterChanged(filters);
  }

  filterClear(filters: TeachFilters) {
    if (filters.assigned || filters.completed || filters.submitted) {
      this.setState({ isClearFilter: true, filters });
    } else {
      this.setState({ isClearFilter: false, filters });
    }
  }

  toggleFilter(filter: TeachFilterFields) {
    const { filters } = this.state;
    filters[filter] = !filters[filter];
    this.filterClear(filters);
    this.props.filterChanged(filters);
  }

  collapseClasses() {
    for (let classroom of this.props.classrooms) {
      classroom.active = false;
    }
  }

  removeClassrooms() {
    this.collapseClasses();
    this.setState({ activeClassroom: null });
    this.props.setActiveClassroom(null);
  }

  toggleClassroom(activeClassroom: TeachClassroom) {
    let active = !activeClassroom.active;
    this.collapseClasses();
    activeClassroom.active = active;
    if (active === true) {
      this.setState({ activeClassroom });
      this.props.setActiveClassroom(activeClassroom.id);
    } else {
      this.setState({activeClassroom: null});
      this.props.setActiveClassroom(null);
    }
  }

  renderClassroom(c: TeachClassroom, i: number) {
    return (
      <div key={i} className="classes-box">
        <div className={"index-box " + (c.active ? "active" : "")} onClick={() => this.toggleClassroom(c)}>
          <span className="classroom-name">{c.name}</span>
          <svg className="svg active arrow-right">
            {/*eslint-disable-next-line*/}
            <use href={sprite + (c.active ? "#arrow-down" : "#arrow-right")} />
          </svg>
          <div className="right-index">
            {c.students.length}
            <svg className="svg active">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#users"} />
            </svg>
            <div className="white-box">
              {c.assignments.length}
            </div>
          </div>
        </div>
        {c.active ? c.students.map((s, i2) =>
          <div className="student-row" key={i2}><span className="student-name">{s.firstName} {s.lastName}</span></div>
        ) : ""}
      </div>
    );
  }

  renderClassesBox() {
    let totalBricks = 0;
    let totalCount = 0;
    for (let classroom of this.props.classrooms) {
      totalCount += classroom.students.length;
      totalBricks += classroom.assignments.length;
    }
    let className = "sort-box teach-sort-box";
    if (!this.state.filterExpanded) {
      className += " sort-box-expanded";
    }
    return (
      <div className={className}>
        <div className="filter-container sort-by-box" style={{ paddingTop: '4vh', paddingBottom: '0.5vh' }}>
          <div className="sort-header">CLASSES</div>
        </div>
        <div className="filter-container indexes-box classrooms-filter">
          <div
            className={"index-box " + (!this.state.activeClassroom ? "active" : "")}
            onClick={this.removeClassrooms.bind(this)}
          >
            View All Classes
            <div className="right-index">
              {totalCount}
              <svg className="svg active">
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#users"} />
              </svg>
              <div className="white-box">
                {totalBricks}
              </div>
            </div>
          </div>
          {this.props.classrooms.map(this.renderClassroom.bind(this))}
        </div>
      </div>
    );
  };

  renderFilterBox = () => {
    let assignedCount = 0;
    let submitedCount = 0;

    for (let classroom of this.props.classrooms) {
      for (let assignemnt of classroom.assignments) {
        if (assignemnt.byStatus) {
          const {byStatus} = assignemnt;
          assignedCount += byStatus[0] ? byStatus[0].count : 0;
          submitedCount += byStatus[1] ? byStatus[1].count : 0;
        } else {
          assignedCount += classroom.students.length;
        }
      }
    }
    
    return (
      <div className="sort-box" style={{ marginTop: '1vh' }}>
        <div className="filter-header">
          OVERVIEW
          <button
            className={
              "btn-transparent filter-icon " +
              (this.state.filterExpanded
                ? this.state.isClearFilter
                  ? "arrow-cancel"
                  : "arrow-up"
                : "arrow-down")
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
          <div className="filter-container subject-indexes-box" style={{ marginTop: '1vh' }}>
            <div className="index-box color1">
              <FormControlLabel
                checked={this.state.filters.assigned}
                control={<Radio onClick={() => this.toggleFilter(TeachFilterFields.Assigned)} className={"filter-radio custom-color"} />}
                label="Assigned to class or Student" />
              <div className="right-index">{assignedCount}</div>
            </div>
            <div className="index-box color2">
              <FormControlLabel
                checked={this.state.filters.submitted}
                control={
                  <Radio onClick={() => this.toggleFilter(TeachFilterFields.Submitted)} className={"filter-radio custom-color"} />
                }
                label="Submitted" />
              <div className="right-index">{submitedCount}</div>
            </div>
            <div className="index-box color4">
              <FormControlLabel
                checked={this.state.filters.completed}
                control={
                  <Radio onClick={e => this.toggleFilter(TeachFilterFields.Completed)} className={"filter-radio custom-color"} />
                }
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
        {this.renderClassesBox()}
        {this.renderFilterBox()}
      </Grid>
    );
  }
}

export default TeachFilterSidebar;
