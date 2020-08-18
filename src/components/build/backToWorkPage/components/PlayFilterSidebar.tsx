import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import sprite from "assets/img/icons-sprite.svg";
import { Brick } from "model/brick";
import { PlayFilters } from '../model';
import { TeachClassroom } from "model/classroom";

enum PlayFilterFields {
  Completed = 'completed',
  Submitted = 'submitted',
  Checked = 'checked'
}

interface FilterSidebarProps {
  classrooms: TeachClassroom[];
  rawBricks: Brick[];
  filterChanged(filters: PlayFilters): void;
}
interface FilterSidebarState {
  activeClassroom: TeachClassroom | null;
  filterExpanded: boolean;
  filters: PlayFilters;
}

class PlayFilterSidebar extends Component<FilterSidebarProps, FilterSidebarState> {
  constructor(props: FilterSidebarProps) {
    super(props);
    this.state = {
      filterExpanded: true,
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

  toggleFilter(filter: PlayFilterFields) {
    const { filters } = this.state;
    filters[filter] = !filters[filter];
    this.props.filterChanged(filters);
  }

  activateClassroom(activeClassroom: TeachClassroom) {
    const { classrooms } = this.props;
    for (let classroom of classrooms) {
      classroom.active = false;
    }
    activeClassroom.active = true;
    this.setState({ activeClassroom });
  }

  removeClassrooms() {
    const { classrooms } = this.props;
    for (let classroom of classrooms) {
      classroom.active = false;
    }
    this.setState({ activeClassroom: null });
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
      <div className="sort-box">
        <div className="filter-container sort-by-box" style={{ paddingTop: '4vh', paddingBottom: '0.5vh' }}>
          <div className="sort-header">INBOX</div>
        </div>
        <div className="filter-container indexes-box classrooms-filter" style={{height: '39vh'}}>
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
    const {filters} = this.state;
    return (
      <div className="sort-box">
        <div className="filter-header">Filter</div>
        {this.state.filterExpanded === true ? (
          <div className="filter-container subject-indexes-box" style={{ marginTop: '5vh' }}>
            <div className="index-box color1">
              <FormControlLabel
                checked={filters.completed}
                control={
                  <Radio onClick={() => this.toggleFilter(PlayFilterFields.Completed)} className={"filter-radio custom-color"} />
                }
                label="To be completed" />
              <div className="right-index">{0}</div>
            </div>
            <div className="index-box color2">
              <FormControlLabel
                checked={filters.submitted}
                control={
                  <Radio onClick={() => this.toggleFilter(PlayFilterFields.Submitted)} className={"filter-radio custom-color"} />
                }
                label="Submitted to Teacher" />
              <div className="right-index">{0}</div>
            </div>
            <div className="index-box color4">
              <FormControlLabel
                checked={filters.checked}
                control={
                  <Radio onClick={() => this.toggleFilter(PlayFilterFields.Checked)} className={"filter-radio custom-color"} />
                }
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
