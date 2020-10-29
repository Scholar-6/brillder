import React, { Component } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import { Subject } from "model/brick";
import { TeachClassroom, Assignment } from "model/classroom";

import AssignedBrickDescription from "./AssignedBrickDescription";

export interface TeachListItem {
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
  renderTeachListItem(c: TeachListItem, i: number) {
    if (i >= this.props.startIndex && i < this.props.startIndex + this.props.pageSize) {
      if (c.assignment && c.classroom) {
        return (
          <div key={i}>
            <AssignedBrickDescription
              subjects={this.props.subjects}
              expand={this.props.expand.bind(this)}
              key={i} classroom={c.classroom} assignment={c.assignment}
            />
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
    let k = 0;
    return items.map(item => {
      if (item.classroom && item.assignment === null) {
        k += 0.5;
      } else {
        k += 1;
      }
      return this.renderTeachListItem(item, k);
    });
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
