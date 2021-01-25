import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import './TeachFilterSidebar.scss';
import { TeachClassroom, TeachStudent } from "model/classroom";
import { TeachFilters } from '../../model';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import EmptyFilter from "../filter/EmptyFilter";

enum TeachFilterFields {
  Assigned = 'assigned',
  Completed = 'completed'
}

interface FilterSidebarProps {
  isLoaded: boolean;
  classrooms: TeachClassroom[];
  activeClassroom: TeachClassroom | null;
  setActiveStudent(s: TeachStudent): void;
  setActiveClassroom(id: number | null): void;
  filterChanged(filters: TeachFilters): void;
}

interface FilterSidebarState {
  filterExpanded: boolean;
  filters: TeachFilters;
  isClearFilter: boolean;

  // empty filter
  firstStarted: boolean;
  secondStarted: boolean;
  thirdStarted: boolean;
}

class TeachFilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      filterExpanded: true,
      isClearFilter: false,
      filters: {
        assigned: false,
        completed: false
      },
      firstStarted: true,
      secondStarted: false,
      thirdStarted: false
    };
  }

  componentDidUpdate(prevProps: FilterSidebarProps) {
    if (prevProps.isLoaded === false && this.props.isLoaded === true) {
      //this.setState({firstStarted: true});
    }
  }

  hideFilter() { this.setState({ filterExpanded: false }) }
  expandFilter() { this.setState({ filterExpanded: true }) }

  clearStatus() {
    const { filters } = this.state;
    filters.assigned = false;
    filters.completed = false;
    this.filterClear(filters);
    this.props.filterChanged(filters);
  }

  filterClear(filters: TeachFilters) {
    if (filters.assigned || filters.completed) {
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

  removeClassrooms() {
    this.props.setActiveClassroom(null);
  }

  toggleClassroom(activeClassroom: TeachClassroom) {
    let active = !activeClassroom.active;
    if (active === true) {
      this.props.setActiveClassroom(activeClassroom.id);
    } else {
      this.props.setActiveClassroom(null);
    }
  }

  renderClassroom(c: TeachClassroom, i: number) {
    return (
      <div key={i} className="classes-box">
        <div className={"index-box " + (c.active ? "active" : "")} onClick={() => this.toggleClassroom(c)}>
          <div className={"classroom-name " + (c.active ? "icon-animated" : "")}>
            <span>{c.name}</span>
            {
              c.active &&
              <div className="classroom-icon svgOnHover">
                <SpriteIcon name="arrow-right" className="active" />
              </div>
            }
          </div>
          <div className="right-index">
            {c.students.length}
            <SpriteIcon name="users" className="active" />
            <div className="classrooms-box">
              {c.assignments.length}
            </div>
          </div>
        </div>
        {c.active && c.students.map((s, i2) =>
          <div className="student-row" key={i2} onClick={() => this.props.setActiveStudent(s)}>
            <span className="student-name">{s.firstName} {s.lastName}</span>
          </div>
        )}
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
        <div className="filter-container sort-by-box">
          <div style={{ display: 'flex' }}>
            <div className="class-header" style={{ width: '50%' }}>CLASSES</div>
            <div className="individuals-header" style={{ width: '50%', textAlign: 'right' }}>INDIVIDUALS</div>
          </div>
        </div>
        <div className="filter-container indexes-box classrooms-filter">
          <div
            className={"index-box " + (!this.props.activeClassroom ? "active" : "")}
            onClick={this.removeClassrooms.bind(this)}
          >
            View All Classes
            <div className="right-index">
              {totalCount}
              <SpriteIcon name="users" className="active" />
              <div className="classrooms-box">
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
    let completedCount = 0;

    for (let classroom of this.props.classrooms) {
      for (let assignemnt of classroom.assignments) {
        if (assignemnt.byStatus) {
          const { byStatus } = assignemnt;
          assignedCount += byStatus[0] ? byStatus[0].count : 0;
          completedCount += byStatus[1] ? byStatus[1].count : 0;
        } else {
          assignedCount += classroom.students.length;
        }
      }
    }

    return (
      <div className="sort-box">
        <div className="filter-header">
          LIVE OVERVIEW
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
        {this.state.filterExpanded === true && (
          <div className="filter-container subject-indexes-box">
            <div className="index-box color1">
              <FormControlLabel
                checked={this.state.filters.assigned}
                control={<Radio onClick={() => this.toggleFilter(TeachFilterFields.Assigned)} className={"filter-radio custom-color"} />}
                label="Assigned to class or Student" />
              <div className="right-index" style={{ height: 'auto' }}>{assignedCount}</div>
            </div>
            <div className="index-box color4">
              <FormControlLabel
                checked={this.state.filters.completed}
                control={
                  <Radio onClick={e => this.toggleFilter(TeachFilterFields.Completed)} className={"filter-radio custom-color"} />
                }
                label="Completed" />
              <div className="right-index" style={{ height: 'auto' }}>{completedCount}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  renderContent() {
    if (!this.props.isLoaded) {
      return <div></div>
    }
    if (this.props.isLoaded && this.props.classrooms.length === 0) {
      return <EmptyFilter />;
    }
    let divs = [];
    divs.push(this.renderClassesBox());
    divs.push(this.renderFilterBox());
    return divs;
  }

  render() {
    return (
      <Grid container item xs={3} className="sort-and-filter-container teach-assigned">
        {this.renderContent()}
      </Grid>
    );
  }
}

export default TeachFilterSidebar;
