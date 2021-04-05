import React, { Component } from "react";
import { Grid } from "@material-ui/core";

import './TeachFilterSidebar.scss';
import { TeachClassroom, TeachStudent } from "model/classroom";
import { TeachFilters } from '../../model';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import EmptyFilter from "../filter/EmptyFilter";
import RadioButton from "components/baseComponents/buttons/RadioButton";
import CreateClassDialog from "components/teach/manageClassrooms/components/CreateClassDialog";
import { Subject } from "model/brick";
import { isArchived } from "../service/service";

enum TeachFilterFields {
  Assigned = 'assigned',
  Completed = 'completed'
}

interface FilterSidebarProps {
  isLoaded: boolean;
  classrooms: TeachClassroom[];
  activeStudent: TeachStudent | null;
  activeClassroom: TeachClassroom | null;
  setActiveStudent(s: TeachStudent): void;
  setActiveClassroom(id: number | null): void;
  filterChanged(filters: TeachFilters): void;
  createClass(name: string, subject: Subject): void;
  isArchive: boolean;
}

interface FilterSidebarState {
  filterExpanded: boolean;
  filters: TeachFilters;
  isClearFilter: boolean;
  createClassOpen: boolean;
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
      createClassOpen: false
    };
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

  toggleClassroom(e: any, activeClassroom: TeachClassroom) {
    e.stopPropagation();
    e.preventDefault();
    let active = !activeClassroom.active;
    if (active === true) {
      this.props.setActiveClassroom(activeClassroom.id);
    } else {
      this.props.setActiveClassroom(null);
    }
  }

  renderStudent(s: TeachStudent, key: number) {
    let className = "student-row";

    if (this.props.activeStudent) {
      if (s.id === this.props.activeStudent.id) {
        className += " active";
      }
    }

    return (
      <div className={className} key={key} onClick={() => this.props.setActiveStudent(s)}>
        <span className="student-name">{s.firstName} {s.lastName}</span>
      </div>
    );
  }

  renderClassroom(c: TeachClassroom, i: number) {
    return (
      <div key={i} className="classes-box">
        <div className={"index-box " + (c.active ? "active" : "")} onClick={e => this.toggleClassroom(e, c)} title={c.name}>
          <div className={"classroom-name " + (c.active ? "icon-animated" : "")}>
            <RadioButton checked={c.active} color={c.subject.color} name={c.subject.name} />
            <span className="filter-class-name">{c.name}</span>
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
              {this.getClassAssignedCount(c)}
            </div>
          </div>
        </div>
        {c.active && c.students.map(this.renderStudent.bind(this))}
      </div>
    );
  }

  getClassAssignedCount(classroom: TeachClassroom) {
    let classBricks = 0;
    for (const assignment of classroom.assignments) {
      const archived = isArchived(assignment);
      if (this.props.isArchive) {
        if (archived) {
          classBricks += 1;
        }
      } else {
        if (!archived) {
          classBricks += 1;
        }
      }
    }
    return classBricks;
  }

  renderClassesBox() {
    let totalBricks = 0;
    let totalCount = 0;
    for (let classroom of this.props.classrooms) {
      totalCount += classroom.students.length;
      totalBricks += this.getClassAssignedCount(classroom);
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
          </div>
        </div>
        <div className="create-class-button" onClick={() => this.setState({ createClassOpen: true })}>
          + Create Class
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
          <div className="sidebar-footer" />
        </div>
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
    return this.renderClassesBox();
  }

  render() {
    return (
      <Grid container item xs={3} className="sort-and-filter-container teach-assigned">
        {this.renderContent()}
        <CreateClassDialog
          isOpen={this.state.createClassOpen}
          submit={(name, subject) => {
            this.props.createClass(name, subject);
            this.setState({ createClassOpen: false })
          }}
          close={() => { this.setState({ createClassOpen: false }) }}
        />
      </Grid>
    );
  }
}

export default TeachFilterSidebar;
