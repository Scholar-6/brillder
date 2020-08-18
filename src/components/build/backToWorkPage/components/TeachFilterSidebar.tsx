import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { TeachClassroom, } from "model/classroom";
import { Brick } from "model/brick";
import { SortBy, Filters } from '../model';
import sprite from "assets/img/icons-sprite.svg";


interface FilterSidebarProps {
  classrooms: TeachClassroom[];
  rawBricks: Brick[];
  filters: Filters;
  sortBy: SortBy;
  isClearFilter: boolean;
  setActiveClassroom(id: number): void;
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
  activeClassroom: TeachClassroom | null;
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

  removeClassrooms() {
    const { classrooms } = this.props;
    for (let classroom of classrooms) {
      classroom.active = false;
    }
    this.setState({ activeClassroom: null });
  }

  activateClassroom(activeClassroom: TeachClassroom) {
    const { classrooms } = this.props;
    for (let classroom of classrooms) {
      classroom.active = false;
    }
    activeClassroom.active = true;
    this.setState({ activeClassroom });
  }

  renderClassroom(c: TeachClassroom, i: number) {
    return (
      <div key={i} className="classes-box">
        <div className={"index-box " + (c.active ? "active" : "")} onClick={() => this.activateClassroom(c)}>
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
              {2}
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
    return (
      <div className="sort-box">
        <div className="filter-container sort-by-box" style={{ paddingTop: '4vh', paddingBottom: '0.5vh' }}>
          <div className="sort-header">CLASSES</div>
        </div>
        <div className="filter-container indexes-box classrooms-filter">
          <div
            className={"index-box " + (!this.state.activeClassroom ? "active" : "")}
            onClick={() => this.removeClassrooms()}
          >
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
          {this.props.classrooms.map(this.renderClassroom.bind(this))}
        </div>
      </div>
    );
  };

  renderFilterBox = () => {
    return (
      <div className="sort-box" style={{ marginTop: '1vh' }}>
        <div className="filter-header">Filter</div>
        {this.state.filterExpanded === true ? (
          <div className="filter-container subject-indexes-box" style={{ marginTop: '1vh' }}>
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
        {this.renderClassesBox()}
        {this.renderFilterBox()}
      </Grid>
    );
  }
}

export default TeachFilterSidebar;
