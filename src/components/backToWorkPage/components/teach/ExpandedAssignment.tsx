import React, { Component } from "react";
import { connect } from "react-redux";

import './ExpandedAssignment.scss';
import sprite from "assets/img/icons-sprite.svg";
import { ReduxCombinedState } from "redux/reducers";
import { Subject } from "model/brick";
import { UserBase } from "model/user";
import { Assignment, StudentStatus, TeachClassroom } from "model/classroom";

import AssignedBrickDescription from './AssignedBrickDescription';

interface AssignmentBrickProps {
  stats: any;
  subjects: Subject[];
  startIndex: number;
  pageSize: number;
  classroom: TeachClassroom;
  assignment: Assignment;
  minimize(): void;
}

class ExpandedAssignment extends Component<AssignmentBrickProps> {
  renderStatus(studentStatus: StudentStatus | undefined) {
    if (studentStatus) {
      return <div className="teach-circle">{Math.round(studentStatus.avgScore)}</div>;
    }
    return (
      <svg className="svg active reminder-icon">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#reminder"} />
      </svg>
    );
  }
  renderStudent(student: UserBase, i: number) {
    const studentStatus = this.props.assignment.studentStatus.find(s => s.studentId === student.id);
    return (
      <tr className="user-row" key={i}>
        <td className="student-left-padding"></td>
        <td className="assigned-student-name">{student.firstName} {student.lastName}</td>
        <td className="circle-td">
          {this.renderStatus(studentStatus)}
        </td>
        <td style={{width: '22.5vw'}}></td>
        <td>
          { studentStatus ?
            <div style={{display: 'flex'}}>
              <svg className="svg active" style={{ height: '2.1vw', width: '2.1vw', display: 'flex' }}>
                {/*eslint-disable-next-line*/}
                <use href={sprite + "#trending-up"} />
              </svg>
              <div className="stats-text">Stats</div>
            </div>
            : "" }
        </td>
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
            isExpanded={true}
            subjects={this.props.subjects}
            minimize={this.props.minimize}
            classroom={classroom} assignment={assignment}
          />
        </div>
        <div className="users-table">
          <table cellSpacing="0" cellPadding="0">
          <tbody>
            {students.map(this.renderStudent.bind(this))}
          </tbody>
        </table>
        </div>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ stats: state.stats.stats });

export default connect(mapState)(ExpandedAssignment);
