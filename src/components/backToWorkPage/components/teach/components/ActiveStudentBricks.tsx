import React, { Component } from "react";

import { TeachClassroom, TeachStudent } from "model/classroom";
import { getStudentAssignments } from "services/axios/brick";
import { AssignmentBrick } from "model/assignment";
import { Subject } from "model/brick";

import AssignedBrickDescription from "./AssignedBrickDescription";
import BackPagePagination from "../../BackPagePagination";


interface ActiveStudentBricksProps {
  classroom: TeachClassroom | null;
  subjects: Subject[];
  activeStudent: TeachStudent;
}

interface ActiveStudentState {
  sortedIndex: number;
  pageSize: number;
  isLoaded: boolean;
  activeAssignment: AssignmentBrick | null;
  assignments: AssignmentBrick[];
}

class ActiveStudentBricks extends Component<ActiveStudentBricksProps, ActiveStudentState> {
  constructor(props: ActiveStudentBricksProps) {
    super(props);

    this.state = {
      sortedIndex: 0,
      pageSize: 6,
      isLoaded: false,
      activeAssignment: null,
      assignments: []
    }
    this.loadAssignments(props.activeStudent.id);
  }

  async loadAssignments(studentId: number) {
    let res = await getStudentAssignments(studentId);
    if (res) {
      this.setState({isLoaded: true, assignments: res });
    }
  }

  moveNext() {
    this.setState({sortedIndex: this.state.sortedIndex + this.state.pageSize});
  }

  moveBack() {
    this.setState({sortedIndex: this.state.sortedIndex - this.state.pageSize});
  }

  renderPagination() {
    const itemsCount = this.state.assignments.length;
    return <BackPagePagination
      sortedIndex={this.state.sortedIndex}
      pageSize={this.state.pageSize}
      bricksLength={itemsCount}
      moveNext={this.moveNext.bind(this)}
      moveBack={this.moveBack.bind(this)}
    />
  }

  expand(a: AssignmentBrick) {
    if (this.props.classroom) {
    }
  }

  render() {
    return (
      <div>
        <div className="classroom-list">
          {this.state.assignments.map((a, i) => {
            if (i >= this.state.sortedIndex && i < this.state.sortedIndex + this.state.pageSize) {
              return (
                <div>
                  <AssignedBrickDescription
                    subjects={this.props.subjects}
                    expand={() => this.expand(a)}
                    key={i} assignment={a as any}
                 />
                </div>
              );
            }
          })}
        </div>
        {this.renderPagination()}
      </div>
    );
  }
}

export default ActiveStudentBricks;
