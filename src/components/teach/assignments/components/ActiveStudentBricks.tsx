import React, { Component } from "react";

import { Assignment, TeachClassroom, TeachStudent } from "model/classroom";
import { getStudentAssignments } from "services/axios/brick";
import { Subject } from "model/brick";

import AssignedBrickDescription from "./AssignedBrickDescription";
import BackPagePagination from "../../../backToWorkPage/components/BackPagePagination";
import { getAssignmentStats } from "services/axios/stats";
import ExpandedStudentAssignment from "./ExpandedStudentAssignment";

interface ActiveStudentBricksProps {
  classroom: TeachClassroom | null;
  subjects: Subject[];
  activeStudent: TeachStudent;
}

interface ActiveStudentState {
  sortedIndex: number;
  pageSize: number;
  isLoaded: boolean;
  activeAssignment: Assignment | null;
  assignmentStats: any;
  assignments: Assignment[];
}

class ActiveStudentBricks extends Component<
  ActiveStudentBricksProps,
  ActiveStudentState
> {
  constructor(props: ActiveStudentBricksProps) {
    super(props);

    console.log(props);

    this.state = {
      sortedIndex: 0,
      pageSize: 6,
      isLoaded: false,
      activeAssignment: null,
      assignmentStats: null,
      assignments: [],
    };
    this.loadAssignments(props.activeStudent.id);
  }

  async loadAssignments(studentId: number) {
    let res = (await getStudentAssignments(studentId)) as Assignment[] | null;
    if (res) {
      this.setState({ isLoaded: true, assignments: res });
    }
  }

  moveNext() {
    this.setState({
      sortedIndex: this.state.sortedIndex + this.state.pageSize,
    });
  }

  moveBack() {
    this.setState({
      sortedIndex: this.state.sortedIndex - this.state.pageSize,
    });
  }

  renderPagination() {
    const itemsCount = this.state.assignments.length;
    return (
      <BackPagePagination
        sortedIndex={this.state.sortedIndex}
        pageSize={this.state.pageSize}
        bricksLength={itemsCount}
        moveNext={this.moveNext.bind(this)}
        moveBack={this.moveBack.bind(this)}
      />
    );
  }

  async setActiveAssignment(a: Assignment) {
    const assignmentStats = await getAssignmentStats(a.id);
    this.setState({ sortedIndex: 0, activeAssignment: a, assignmentStats });
  }

  renderStudentAssignments() {
    return (
      <div className="classroom-list">
        {this.state.assignments.map((a, i) => {
          if (
            i >= this.state.sortedIndex &&
            i < this.state.sortedIndex + this.state.pageSize
          ) {
            return (
              <div key={i}>
                <AssignedBrickDescription
                  subjects={this.props.subjects}
                  expand={() => this.setActiveAssignment(a)}
                  key={i}
                  assignment={a as any}
                />
              </div>
            );
          }
          return "";
        })}
      </div>
    );
  }

  renderExpandedAssignment(a: Assignment) {
    return (
      <ExpandedStudentAssignment
        assignment={a}
        student={this.props.activeStudent}
        stats={this.state.assignmentStats}
        subjects={this.props.subjects}
        minimize={() =>
          this.setState({ assignmentStats: null, activeAssignment: null })
        }
      />
    );
  }

  render() {
    const { activeAssignment } = this.state;
    return (
      <div>
        {activeAssignment
          ? this.renderExpandedAssignment(activeAssignment)
          : this.renderStudentAssignments()}
        {this.renderPagination()}
      </div>
    );
  }
}

export default ActiveStudentBricks;
