import React, { Component } from "react";
import { connect } from "react-redux";

import './ClassroomList.scss';
import { ReduxCombinedState } from "redux/reducers";
import { Subject } from "model/brick";
import { TeachClassroom, Assignment } from "model/classroom";

import AssignedBrickDescription from "./AssignedBrickDescription";
import NameAndSubjectForm from "components/teach/components/NameAndSubjectForm";
import { updateClassroom } from "services/axios/classroom";

export interface TeachListItem {
  classroom: TeachClassroom;
  assignment: Assignment | null;
}

interface ClassroomListProps {
  stats: any;
  subjects: Subject[];
  startIndex: number;
  pageSize: number;
  activeClassroom: TeachClassroom;
  expand(classroomId: number, assignmentId: number): void;
  reloadClass(id: number): void;
}

class ClassroomList extends Component<ClassroomListProps> {
  async updateClassroom(classroom: TeachClassroom, name: string, subject: Subject) {
    let classroomApi = {
      id: classroom.id,
      name: name,
      subjectId: subject.id,
      subject: subject,
      status: classroom.status,
      updated: classroom.updated,
    } as any;
    let success = await updateClassroom(classroomApi);
    if (success) {
      this.props.reloadClass(classroom.id);
    }
  }
  
  renderClassname() {
    const classroom = this.props.activeClassroom as any;
    let className = 'classroom-title';
    return (
      <div className={className}>
        <NameAndSubjectForm
          name={classroom!.name}
          subject={classroom.subject}
          onChange={(name, subject) => this.updateClassroom(classroom, name, subject)}
        />
      </div>
    );
  }

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
    }
    return "";
  }

  prepareClassItems(items: TeachListItem[], classroom: TeachClassroom) {
    for (let assignment of classroom.assignments) {
      let item: TeachListItem = {
        classroom,
        assignment
      };
      items.push(item);
    }
  }

  renderContent() {
    const {activeClassroom} = this.props;
    let items = [] as TeachListItem[];
    this.prepareClassItems(items, activeClassroom);
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
      <div className="classroom-list one-classroom-assignments">
        <div className="fixed-classname">
          {this.renderClassname()}
        </div>
        {this.renderContent()}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ stats: state.stats.stats });

export default connect(mapState)(ClassroomList);
