import React, { Component } from "react";

import { TeachClassroom, } from "model/classroom";


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
        {this.props.classrooms.map((c, i) => <div className="classroom-title" key={i}>{c.name}</div>)}
      </div>
    );
  }
}

export default ClassroomList;
