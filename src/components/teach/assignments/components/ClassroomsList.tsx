import React, { Component } from "react";
import { connect } from "react-redux";
import { Grow } from "@material-ui/core";

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
  classrooms: TeachClassroom[];
  startIndex: number;
  pageSize: number;
  activeClassroom: TeachClassroom | null;
  expand(classroomId: number, assignmentId: number): void;
  reloadClasses(): void;
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
          <NameAndSubjectForm
            name={classroom!.name}
            subject={classroom.subject}
            onChange={(name, subject) => this.updateClassroom(classroom, name, subject)}
          />
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
                expand={this.props.expand.bind(this)}
                key={i} classroom={c.classroom} assignment={c.assignment}
              />
            </div>
          </Grow>
        );
      }
      return this.renderClassname(c, i);
    }
    return "";
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
    const { activeClassroom, classrooms } = this.props;
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
