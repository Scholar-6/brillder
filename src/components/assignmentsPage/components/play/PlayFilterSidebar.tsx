import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { stripHtml } from "components/build/questionService/ConvertService";
import { Classroom } from "model/classroom";
import SortButton from "components/teach/assignments/components/SortButton";
import { SortClassroom } from "components/admin/bricksPlayed/BricksPlayedSidebar";

interface FilterSidebarProps {
  assignmentsLength: number;
  classrooms: Classroom[];
  classSort: SortClassroom;
  activeClassroomId: number;
  sorting(sort: SortClassroom): void;
  setActiveClassroom(classroom: number): void;
}

class PlayFilterSidebar extends Component<FilterSidebarProps> {
  renderNumber(c: Classroom) {
    if (c.assignmentsBrick && c.assignmentsBrick.length) {
      const count = c.assignmentsBrick.filter(a => a.bestScore && a.bestScore > 0).length;

      let className = 'white-box';
      if (count === c.assignmentsBrick.length) {
        className += ' completed';
      }

      return (
        <div className="right-index">
          <div className={className}>{count}/{c.assignmentsBrick.length}</div>
        </div>
      );
    }
    return '';
  }

  renderClassroomBox = (c: Classroom, i: number) => {
    const { activeClassroomId } = this.props;

    return (
      <div className="index-box" onClick={() => this.props.setActiveClassroom(c.id)} key={i}>
        <FormControlLabel
          checked={activeClassroomId === c.id}
          control={<Radio className="filter-radio custom-color" />}
          label="" />
        {stripHtml(c.name)}
        {this.renderNumber(c)}
      </div>
    );
  }

  render() {
    const { activeClassroomId } = this.props;

    let count = 0;
    for (let c of this.props.classrooms) {
      count += c.assignmentsBrick.filter(a => a.bestScore && a.bestScore > 0).length;
    }

    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        <div className="sort-box teach-sort-box play-index-box">
          <div className="filter-container sort-by-box">
            <div className="sort-header">INBOX</div>
            {this.props.activeClassroomId > 0 ? <div /> :
            <SortButton classroom="sort-dialog-ew55" sort={this.props.classSort} sortByName={() => {
              this.props.sorting(SortClassroom.Name);
            }} sortByDate={() => {
              this.props.sorting(SortClassroom.Date);
            }} sortByAssignmets={() => {
              this.props.sorting(SortClassroom.Assignment);
            }} />}
          </div>
          <div className="filter-container indexes-box classrooms-filter">
            <div className="index-box" onClick={() => this.props.setActiveClassroom(-1)}>
              <FormControlLabel
                checked={activeClassroomId > 0 ? false : true}
                control={<Radio className={"filter-radio custom-color"} />}
                label="" />
              All Classes
              <div className="right-index">
                <div className="white-box">{count}/{this.props.assignmentsLength}</div>
              </div>
            </div>
            {this.props.classrooms.map((c, i) => this.renderClassroomBox(c, i))}
          </div>
        </div>
        <div className="sidebar-footer" />
      </Grid>
    );
  }
}

export default PlayFilterSidebar;
