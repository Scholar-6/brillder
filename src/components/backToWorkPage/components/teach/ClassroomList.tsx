import React, { Component } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { TeachClassroom, } from "model/classroom";
import AssignedBrickDescription from "./AssignedBrickDescription";


interface ClassroomListProps {
  stats: any;
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

  renderClassroom(c: TeachClassroom, i: number) {
    if (i >= this.props.startIndex && i < this.props.startIndex + this.props.pageSize) {
      return (
        <div className="classroom-title" key={i}>
          {c.name}
          {}
          {c.assignments.map((a, i) => <AssignedBrickDescription expand={() => this.props.expand(c.id)} key={i} classroom={c} assignment={a} />)}
        </div>
      )
    }
    return "";
  }

  renderActiveClassroom(c: TeachClassroom) {
    return (
      <div className="classroom-title">
        {c.name}
        {}
        {c.assignments.map((a, i) => <AssignedBrickDescription expand={()=>{}} key={i} classroom={c} assignment={a} />)}
      </div>
    )
  }

  renderContent() {
    const {activeClassroom} = this.props;
    if (activeClassroom) {
      return this.renderActiveClassroom(activeClassroom);
    }
    return this.props.classrooms.map(this.renderClassroom.bind(this));
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
