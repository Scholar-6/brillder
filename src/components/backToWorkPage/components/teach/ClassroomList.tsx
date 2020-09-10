import React, { Component } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { Subject } from "model/brick";
import { TeachClassroom, Assignment } from "model/classroom";

import AssignedBrickDescription from "./AssignedBrickDescription";

interface TeachListItem {
  classroom: TeachClassroom;
  assignment: Assignment | null;
}

interface ClassroomListProps {
  stats: any;
  subjects: Subject[];
  classrooms: TeachClassroom[];
  startIndex: number;
  pageSize: number;
  activeClassroom: TeachClassroom | null;
  expand(classroomId: number): void;
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
    return <div className={className} onClick={() => this.setState({ isArchive: true })}>ARCHIVE</div>;
  }

  renderLiveBricksButton() {
    let className = this.state.isArchive ? "" : "active";
    return <div className={className} onClick={() => this.setState({ isArchive: false })}>LIVE BRICKS</div>;
  }

  renderTeachListItem(c: TeachListItem, i: number) {
    if (i >= this.props.startIndex && i < this.props.startIndex + this.props.pageSize) {
      if (c.assignment && c.classroom) {
        return <AssignedBrickDescription
          subjects={this.props.subjects}
          expand={() => this.props.expand(c.classroom.id)}
          key={i} classroom={c.classroom} assignment={c.assignment}
        />
      }
      return (
        <div className="classroom-title" key={i}>
          {c.classroom.name}
        </div>
      );
    }
    return "";
  }

  renderActiveClassroom(c: TeachClassroom) {
    return (
      <div className="classroom-title">
        {c.name}
        {}
        {c.assignments.map((a, i) => <AssignedBrickDescription
          subjects={this.props.subjects} expand={()=>{}} key={i} classroom={c} assignment={a}
        />)}
      </div>
    )
  }

  renderContent() {
    const {activeClassroom, classrooms} = this.props;
    if (activeClassroom) {
      return this.renderActiveClassroom(activeClassroom);
    }
    let items = [];
    for (let classroom of classrooms) {
      let item: TeachListItem = {
        classroom,
        assignment: null
      };
      items.push(item);
      for (let assignment of classroom.assignments) {
        let item: TeachListItem = {
          classroom,
          assignment
        };
        items.push(item);
      }
    }
    return items.map(this.renderTeachListItem.bind(this));
  }

  render() {
    return (
      <div className="classroom-list">
        <div className="classroom-list-buttons">
          {this.renderLiveBricksButton()}
          {this.renderArchiveButton()}
        </div>
        {this.renderContent()}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ stats: state.stats.stats });

export default connect(mapState)(ClassroomList);
