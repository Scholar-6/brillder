import React, { Component } from "react";
import { Grid } from "@material-ui/core";

import { ClassroomApi } from "components/teach/service";
import { Tab } from "./service";

interface FilterSidebarProps {
  assignmentsLength: number;
  classrooms: ClassroomApi[];
  activeClassroomId: number;
  activeTab: Tab;
  setActiveClassroom(classroom: number): void;
}

class PlayFilterSidebar extends Component<FilterSidebarProps> {
  renderClassroomBox = (c: ClassroomApi, i: number) => {
    const { activeClassroomId } = this.props;

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

  render() {
    const { activeClassroomId } = this.props;

    return (
      <Grid container item xs={3} className="sort-and-filter-container">
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
      </Grid>
    );
  }
}

export default PlayFilterSidebar;
