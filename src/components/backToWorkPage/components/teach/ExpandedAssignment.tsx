import React, { Component } from "react";
import { connect } from "react-redux";

import './ExpandedAssignment.scss';
import { ReduxCombinedState } from "redux/reducers";
import { Subject } from "model/brick";
import { Assignment, TeachClassroom } from "model/classroom";

import AssignedBrickDescription from './AssignedBrickDescription';
import { UserBase } from "model/user";

interface AssignmentBrickProps {
  stats: any;
  subjects: Subject[];
  startIndex: number;
  pageSize: number;
  classroom: TeachClassroom;
  assignment: Assignment;
}

class ExpandedAssignment extends Component<AssignmentBrickProps> {
  renderStudent(student: UserBase, i: number) {
    return (
      <tr className="user-row" key={i}>
        <td className="student-left-padding"></td>
        <td>{student.firstName} {student.lastName}</td>
        <td></td>
        <td></td>
      </tr>
    );
  }

  render() {
    const {assignment, classroom, startIndex, pageSize} = this.props;
    let {students} = classroom;
    students = students.slice(startIndex, startIndex + pageSize);
    return (
      <div className="expanded-assignment classroom-list">
        <div className="classroom-title">{classroom.name}</div>
        <div>
          <AssignedBrickDescription
            subjects={this.props.subjects}
            expand={() => {}}
            classroom={classroom} assignment={assignment}
          />
        </div>
        <div className="users-table">
          <table cellSpacing="0" cellPadding="0">
          <tbody>
            {students.map(this.renderStudent)}
          </tbody>
        </table>
        </div>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ stats: state.stats.stats });

export default connect(mapState)(ExpandedAssignment);
