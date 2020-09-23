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
        <td className="padding-left-column"></td>
        <td className="student-status">
          <div>
            {this.renderStatus(studentStatus)}
          </div>
        </td>
        <td className="student-book">
          <div>
            {this.renderStatus(studentStatus)}
          </div>
        </td>
        <td className="assigned-student-name">{student.firstName} {student.lastName}</td>
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
        <div className="classroom-title first">{classroom.name}</div>
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
            <thead>
              <tr>
                <th></th>
                <th>
                  <div className="center">
                    <button className="btn btn-transparent svgOnHover btn-grey-circle">
                      <svg className="svg active">
                        <use href={sprite + "#arrow-down"} className="text-theme-dark-blue" />
                      </svg>
                    </button>
                  </div>
                </th>
                <th>
                  <div className="center">
                    <button className="btn btn-transparent svgOnHover btn-grey-circle">
                      <svg className="svg active">
                        <use href={sprite + "#arrow-right"} className="text-theme-dark-blue" />
                      </svg>
                    </button>
                  </div>
                </th>
                <th></th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
                <th>8</th>
                <th>9</th>
              </tr>
            </thead>
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
