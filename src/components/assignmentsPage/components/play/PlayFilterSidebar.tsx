import React, { Component } from "react";
import { Grid, FormControlLabel, Radio } from "@material-ui/core";

import { ClassroomApi } from "components/teach/service";
import { Tab } from "./service";
import { stripHtml } from "components/build/questionService/ConvertService";

interface FilterSidebarProps {
  assignmentsLength: number;
  classrooms: ClassroomApi[];
  activeClassroomId: number;
  activeTab: Tab;
  setActiveClassroom(classroom: number): void;
}

class PlayFilterSidebar extends Component<FilterSidebarProps> {
  renderNumber(c: ClassroomApi) {
    if (c.assignmentsCount && c.assignmentsCount >= 1) {
      return (
        <div className="right-index">
          <div className="white-box">{c.assignmentsCount}</div>
        </div>
      )
    }
    return '';
  }

  renderClassroomBox = (c: ClassroomApi, i: number) => {
    const { activeClassroomId } = this.props;

    return (
      <div className={`index-box '}`} onClick={() => this.props.setActiveClassroom(c.id)} key={i}>
        <FormControlLabel
          checked={activeClassroomId === c.id}
          control={<Radio className={"filter-radio custom-color"} />}
          label="" />
        {stripHtml(c.name)}
        {this.renderNumber(c)}
      </div>
    )
  }

  render() {
    const { activeClassroomId } = this.props;

    return (
      <Grid container item xs={3} className="sort-and-filter-container">
        <div className="sort-box teach-sort-box play-index-box">
          <div className="filter-container sort-by-box">
            <div className="sort-header">INBOX</div>
          </div>
          <div className="filter-container indexes-box classrooms-filter">
            <div className="index-box" onClick={() => this.props.setActiveClassroom(-1)}>
              <FormControlLabel
                checked={activeClassroomId > 0 ? false : true}
                control={<Radio className={"filter-radio custom-color"} />}
                label="" />
              All Classes
              <div className="right-index">
                <div className="white-box">{this.props.assignmentsLength}</div>
              </div>
            </div>
            {this.props.classrooms.map((c, i) => this.renderClassroomBox(c, i))}
          </div>
        </div>
      </Grid>
    );
  }
}

export default PlayFilterSidebar;
