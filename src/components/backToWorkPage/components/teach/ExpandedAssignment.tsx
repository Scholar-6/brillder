import React, { Component } from "react";
import { connect } from "react-redux";

import './ExpandedAssignment.scss';
import sprite from "assets/img/icons-sprite.svg";
import { ReduxCombinedState } from "redux/reducers";
import { Subject } from "model/brick";
import { UserBase } from "model/user";
import { Assignment, StudentStatus, TeachClassroom } from "model/classroom";
import { getSubjectColor } from "components/services/subject";

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
  renderAvgScore(studentStatus: StudentStatus) {
    let subjectId = this.props.assignment.brick.subjectId;
    let color = getSubjectColor(this.props.subjects, subjectId);
  
    if (!color) {
      color = "#B0B0AD";
    }

    return (
      <div className="circle" style={{background: color}}>
        {Math.round(studentStatus.avgScore)}
      </div>
    );
  }

  renderStatus(studentStatus: StudentStatus | undefined) {
    if (studentStatus) {
      return this.renderAvgScore(studentStatus);
    }
    return (
      <svg className="svg active reminder-icon">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#reminder"} />
      </svg>
    );
  }

  renderBookIcon() {
    return (
      <svg className="svg active book-open-icon">
        {/*eslint-disable-next-line*/}
        <use href={sprite + "#book-open"} />
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
          {studentStatus ?
          <div>
            {this.renderBookIcon()}
          </div> : ""}
        </td>
        <td className="assigned-student-name">{student.firstName} {student.lastName}</td>
        { Array.from(new Array(24), (x, i) => i).map(a => <td></td>)}
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
                { Array.from(new Array(24), (x, i) => i).map((a, i) => <th>{i + 1}</th>)}
                <th></th>
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
