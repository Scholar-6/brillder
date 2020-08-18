import React, { Component } from "react";
import { Grid } from "@material-ui/core";

import { TeachClassroom, } from "model/classroom";
import sprite from "assets/img/icons-sprite.svg";


interface ClassroomListProps {
  classrooms: TeachClassroom[];
}
interface ClassroomListState {
  activeClassroom: TeachClassroom | null;
  filterExpanded: boolean;
}

class ClassroomList extends Component<ClassroomListProps, ClassroomListState> {
  render() {
    return (
      <div className="classroom-list">
        {this.props.classrooms.map((c, i) => <div className="classroom-title">{c.name}</div>)}
      </div>
    );
  }
}

export default ClassroomList;
