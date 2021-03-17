import React, { Component } from "react";
import { connect } from "react-redux";
import { Grow } from "@material-ui/core";

import { ReduxCombinedState } from "redux/reducers";
import { Subject } from "model/brick";
import { TeachClassroom, Assignment } from "model/classroom";

import AssignedBrickDescription from "./AssignedBrickDescription";
import NameAndSubjectForm from "components/teach/components/NameAndSubjectForm";
import { updateClassroom } from "services/axios/classroom";
import { convertClassAssignments } from "../service/service";

export interface TeachListItem {
  classroom: TeachClassroom;
  notFirst?: boolean; // not first class in list
  assignment: Assignment | null;
}

interface ClassroomListProps {
  stats: any;
  subjects: Subject[];
  classrooms: TeachClassroom[];
  startIndex: number;
  pageSize: number;
  isArchive: boolean;
  activeClassroom: TeachClassroom | null;
  expand(classroomId: number, assignmentId: number): void;
  reloadClasses(): void;
  onRemind?(count: number): void;
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
      this.props.reloadClasses();
    }
  }

  renderClassname(c: TeachListItem, i: number) {
    const { classroom } = c as any;
    let className = 'classroom-title one-of-many';
    if (i === 0) {
      className += ' first';
    }
    return (
      <Grow
        in={true}
        key={i}
        style={{ transformOrigin: "left 0 0" }}
        timeout={i * 200}
      >
        <div className={className}>
          <div>
          <NameAndSubjectForm
            classroom={classroom}
            isArchive={this.props.isArchive}
            onChange={(name, subject) => this.updateClassroom(classroom, name, subject)}
          />
          </div>
        </div>
      </Grow>
    );
  }

  renderTeachListItem(c: TeachListItem, i: number) {
    if (i >= this.props.startIndex && i < this.props.startIndex + this.props.pageSize) {
      if (c.assignment && c.classroom) {
        return (
          <Grow
            in={true}
            key={i}
            style={{ transformOrigin: "left 0 0" }}
            timeout={i * 200}
          >
            <div>
              <AssignedBrickDescription
                subjects={this.props.subjects}
                isArchive={this.props.isArchive}
                expand={this.props.expand.bind(this)}
                key={i} classroom={c.classroom} assignment={c.assignment}
                archive={() => {}}
                onRemind={this.props.onRemind}
              />
            </div>
          </Grow>
        );
      }
      return this.renderClassname(c, i);
    }
    return "";
  }

  prepareClassItems(items: TeachListItem[], classroom: TeachClassroom, notFirst: boolean) {
    let item: TeachListItem = {
      classroom,
      notFirst,
      assignment: null
    };
    items.push(item);
    convertClassAssignments(items, classroom, this.props.isArchive);
  }

  renderContent() {
    const { activeClassroom, classrooms } = this.props;
    let items = [] as TeachListItem[];
    if (activeClassroom) {
      this.prepareClassItems(items, activeClassroom, false);
    } else {
      let notFirst = false;
      for (let classroom of classrooms) {
        this.prepareClassItems(items, classroom, notFirst);
        notFirst = true;
      }
    }
    return items.map(this.renderTeachListItem.bind(this));
  }

  render() {
    return (
      <div className="classroom-list many-classes">
        {this.renderContent()}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ stats: state.stats.stats });

export default connect(mapState)(ClassroomList);
