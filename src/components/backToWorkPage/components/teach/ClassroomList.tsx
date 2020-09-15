import React, { Component } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { Subject } from "model/brick";
import { TeachClassroom, Assignment, StudentStatus } from "model/classroom";

import AssignedBrickDescription from "./AssignedBrickDescription";
import { UserBase } from "model/user";

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
  expand(classroomId: number, assignmentId: number): void;
}

class ClassroomList extends Component<ClassroomListProps> {
  renderStudent(student: UserBase, i: number, studentsStatus: StudentStatus[]) {
    const studentStatus = studentsStatus.find(s => s.studentId === student.id);
    return (
      <div style={{display: 'flex', paddingTop: '0.5vh', paddingBottom: '0.5vh'}} >
        <div style={{width: '23.8vw'}}>{student.firstName} {student.lastName}</div>
        <div className="teach-circles-container">
          <div className="teach-circle-flex-container">
            { !studentStatus ?
              <div className="teach-circle-container">
                <div className="teach-circle student-circle red" />
              </div> : ""}
          </div>
          <div className="teach-circle-flex-container">
            { studentStatus ?
              <div className="teach-circle-container">
                <div className="teach-circle student-circle green">
                  {Math.round(studentStatus.avgScore)}
                </div>
              </div> : ""}
          </div>
        </div>
      </div>
    );
  }

  renderStudentsList(c: TeachClassroom, a: Assignment) {
    if (!this.props.activeClassroom) return "";
    return (
      <div>
        {c.students.map((s, i) => this.renderStudent(s, i, a.studentStatus))}
      </div>
    );
  }

  renderTeachListItem(c: TeachListItem, i: number) {
    if (i >= this.props.startIndex && i < this.props.startIndex + this.props.pageSize) {
      if (c.assignment && c.classroom) {
        return (
          <div>
            <AssignedBrickDescription
              subjects={this.props.subjects}
              expand={this.props.expand.bind(this)}
              key={i} classroom={c.classroom} assignment={c.assignment}
            />
            {this.renderStudentsList(c.classroom, c.assignment)}
          </div>
        );
      }
      let className = 'classroom-title';
      if (i === 0) {
         className += ' first';
      }
      return (
        <div className={className} key={i}>
          <div>{c.classroom.name}</div>
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
          subjects={this.props.subjects} expand={this.props.expand.bind(this)} key={i} classroom={c} assignment={a}
        />)}
      </div>
    )
  }

  prepareClassItems(items: TeachListItem[], classroom: TeachClassroom) {
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

  renderContent() {
    const {activeClassroom, classrooms} = this.props;
    let items = [] as TeachListItem[];
    if (activeClassroom) {
      this.prepareClassItems(items, activeClassroom);
    } else {
      for (let classroom of classrooms) {
        this.prepareClassItems(items, classroom);
      }
    }
    return items.map(this.renderTeachListItem.bind(this));
  }

  render() {
    return (
      <div className="classroom-list">
        {this.renderContent()}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ stats: state.stats.stats });

export default connect(mapState)(ClassroomList);
