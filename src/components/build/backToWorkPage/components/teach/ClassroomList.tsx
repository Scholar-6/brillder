import React, { Component } from "react";

import { TeachClassroom, } from "model/classroom";
import AssignedBrickDescription from "./AssignedBrickDescription";


interface ClassroomListProps {
  classrooms: TeachClassroom[];
}
interface ClassroomListState {
  isArchive: boolean
}

class ClassroomList extends Component<ClassroomListProps, ClassroomListState> {
  constructor(props: ClassroomListProps) {
    super(props);
    this.state = {
      isArchive: false
    }
  }

  renderArchiveButton() {
    let className = this.state.isArchive ? "active" : "";
    return <div className={className} onClick={() =>this.setState({isArchive: true})}>ARCHIVE</div>;
  }

  renderLiveBricksButton() {
    let className = this.state.isArchive ? "" : "active";
    return <div className={className} onClick={() => this.setState({isArchive: false})}>LIVE BRICKS</div>;
  }

  render() {
    return (
      <div className="classroom-list">
        <div className="classroom-list-buttons">
          {this.renderLiveBricksButton()}
          {this.renderArchiveButton()}
        </div>
        {this.props.classrooms.map((c, i) => 
          <div className="classroom-title" key={i}>
            {c.name}
            {}
            {c.assignments.map(a => <AssignedBrickDescription brick={a.brick} />)}
          </div>
        )}
      </div>
    );
  }
}

export default ClassroomList;
