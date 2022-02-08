import React, { Component } from "react";
import { connect } from "react-redux";
import { Grow } from "@material-ui/core";

import './ClassroomList.scss';
import { ReduxCombinedState } from "redux/reducers";
import { Subject } from "model/brick";
import { TeachClassroom, Assignment } from "model/classroom";

import AssignedBrickDescription from "./AssignedBrickDescription";
import NameAndSubjectForm from "components/teach/components/NameAndSubjectForm";
import { updateClassroom } from "services/axios/classroom";
import { convertClassAssignments } from "../service/service";

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
  isArchive: boolean;
  showPremium(): void;
  expand(classroomId: number, assignmentId: number): void;
  reloadClass(id: number): void;
  onRemind?(count: number, isDeadlinePassed: boolean): void;
}

interface ListState {
  classroom: TeachClassroom;
  shown: boolean;
}

class ClassroomList extends Component<ClassroomListProps, ListState> {
  constructor(props: ClassroomListProps) {
    super(props);

    this.state = {
      classroom: props.activeClassroom,
      shown: false
    }
  }

  componentDidMount() {
    this.setState({ shown: true });
  }

  componentDidUpdate(props: ClassroomListProps) {
    if (this.props.activeClassroom !== props.activeClassroom) {
      this.setState({ shown: false });
      setTimeout(() => {
        this.setState({ shown: true, classroom: this.props.activeClassroom });
      }, 700);
    }
  }

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
    const classroom = this.state.classroom as any;
    let className = 'classroom-title';
    return (
      <div className={className}>
        <NameAndSubjectForm
          classroom={classroom}
          inviteHidden={true}
          isArchive={this.props.isArchive}
          onChange={(name, subject) => this.updateClassroom(classroom, name, subject)}
          onAssigned={() => this.props.reloadClass(classroom.id)}
          showPremium={this.props.showPremium}
        />
      </div>
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
                archive={() => this.props.reloadClass(c.classroom.id)}
                unarchive={() => this.props.reloadClass(c.classroom.id)}
                onRemind={this.props.onRemind}
              />
            </div>
          </Grow>
        );
      }
    }
    return "";
  }

  isArchived(assignment: Assignment) {
    return assignment.studentStatus && assignment.studentStatus.length > 0 && assignment.studentStatus[0].status === 3;
  }

  renderContent() {
    const { classroom } = this.state;
    let items = [] as TeachListItem[];
    convertClassAssignments(items, classroom, this.props.isArchive);
    return items.map((item, i) => this.renderTeachListItem(item, i));
  }

  render() {
    return (
      <div className="classroom-list one-classroom-assignments">
        <div className="classroom-title one-of-many first">
          {this.renderClassname()}
        </div>
        {this.renderContent()}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ stats: state.stats.stats });

export default connect(mapState)(ClassroomList);
