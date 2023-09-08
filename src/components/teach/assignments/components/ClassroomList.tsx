import React, { Component } from "react";
import { Grow } from "@material-ui/core";

import './ClassroomList.scss';
import { Subject } from "model/brick";
import { TeachClassroom, Assignment, TeachStudent } from "model/classroom";

import { updateClassroom } from "services/axios/classroom";
import { convertClassAssignments } from "../service/service";
import EmptyClassTab from "./EmptyClassTab";
import AssignedBrickDescriptionV2 from "./AssignedBrickDescriptionV2";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import NameAndSubjectFormV3 from "components/teach/components/NameAndSubjectFormV3";
import UnassignStudentDialog from "components/teach/manageClassrooms/components/UnassignStudentDialog";
import { MUser } from "components/teach/model";
import { unassignStudent } from "components/teach/service";
import map from "components/map";

export interface TeachListItem {
  classroom: TeachClassroom;
  assignment: Assignment | null;
}

interface ClassroomListProps {
  history: any;
  subjects: Subject[];
  activeClassroom: TeachClassroom;
  reloadClass(id: number): void;
  assignPopup(): void;
  inviteStudents(): void;
  onDelete(classroom: TeachClassroom): void;
  onRemind?(count: number, isDeadlinePassed: boolean): void;
}

interface ListState {
  unassignOpen: boolean;
  unassignStudent: any;
}

class ClassroomList extends Component<ClassroomListProps, ListState> {
  constructor(props: ClassroomListProps) {
    super(props);

    this.state = {
      unassignStudent: null,
      unassignOpen: false,
    }
  }

  async updateClassroomName(classroom: TeachClassroom, name: string) {
    let classroomApi = {
      id: classroom.id,
      name: name,
      status: classroom.status,
      updated: classroom.updated,
    } as any;
    let success = await updateClassroom(classroomApi);
    if (success) {
      classroom.name = name;
      this.props.reloadClass(classroom.id);
    }
  }

  unassignStudent(student: MUser | null) {
    const { activeClassroom } = this.props;
    if (activeClassroom && student) {
      const { id } = activeClassroom;
      unassignStudent(id, student.id).then(res => {
        if (res) {
          const index = activeClassroom.students.findIndex(s => s.id === student.id);
          if (index == -1) {
            const index = activeClassroom.studentsInvitations.findIndex(s => s.id === student.id);
            activeClassroom.studentsInvitations.splice(index, 1);
          } else {
            activeClassroom.students.splice(index, 1);
          }
          this.setState({ unassignOpen: false });
        } else {
          // failture
          this.setState({ unassignOpen: false });
        }
      });
    }
  }

  unassigningStudent(student: TeachStudent) {
    this.setState({ unassignStudent: student, unassignOpen: true });
  }

  renderClassname() {
    const classroom = this.props.activeClassroom as any;
    let className = 'classroom-title';
    return (
      <div className={className}>
        <NameAndSubjectFormV3
          classroom={classroom}
          addBrick={this.props.assignPopup}
          inviteStudents={this.props.inviteStudents}
          onChange={(name) => this.updateClassroomName(classroom, name)}
          onDelete={this.props.onDelete}
        />
      </div>
    );
  }

  renderTeachListItem(c: TeachListItem, i: number) {
    if (c.assignment && c.classroom) {
      return (
        <Grow
          in={true}
          key={i}
          style={{ transformOrigin: "left 0 0" }}
          timeout={i * 200}
        >
          <div className="expanded-assignment">
            <AssignedBrickDescriptionV2
              subjects={this.props.subjects}
              classroom={c.classroom}
              assignment={c.assignment}
            />
          </div>
        </Grow>
      );
    }
    return '';
  }

  renderLibraryLink(student: TeachStudent) {
    let name = '';
    const { firstName } = student;
    let lastLetter = firstName[firstName.length - 1];
    if (lastLetter === 's') {
      name = firstName + "'";
    } else {
      name = firstName + "'s";
    }
    return (
      <div className="absolute-library-link library flex-center" onClick={() => {
        this.props.history.push(map.MyLibrary + '/' + student.id);
      }}>
        <SpriteIcon name="bar-chart-2" />
        <div className="css-custom-tooltip">View {name} library</div>
      </div>
    );
  }

  renderStudent(s: TeachStudent, i: number) {
    return (
      <div className="student" key={i}>
        <div className="email-box">
          <div>
            <div className="name bold font-14">{s.firstName + ' ' + s.lastName}</div>
            <div className="email font-13">{s.email}</div>
          </div>
        </div>
        <div className="flex-center button-box">
          {this.renderLibraryLink(s)}
        </div>
        <div className="flex-center button-box">
          <div className="delete flex-center" onClick={() => {
            this.unassigningStudent(s);
           }}><SpriteIcon name="delete" /></div>
        </div>
      </div>
    );
  }

  renderInvitation(s: any, i: number) {
    return (
      <div className="invitation" key={i}>
        <div className="email-box">
          <div className="email font-13">{s.email}</div>
          <div className="flex-center">
            <div className="pending flex-center bold font-11">Pending</div>
          </div>
        </div>
        <div className="flex-center button-box">
          <div className="delete flex-center" onClick={() => {
            this.unassigningStudent(s);
           }}><SpriteIcon name="delete" /></div>
        </div>
      </div>
    );
  }

  renderContent() {
    const classroom = this.props.activeClassroom;
    let items = [] as TeachListItem[];

    convertClassAssignments(items, classroom);

    if (items.length === 0) {
      return <EmptyClassTab history={this.props.history} activeClassroom={classroom} />;
    }

    return (
      <div className="classroom-assignments-columns">
        <div className="assignments-column">
          <div className="bold assignments-title font-20">Assignments</div>
          {items.map((item, i) => this.renderTeachListItem(item, i))}
        </div>
        <div className="students-column">
          <div>
            <div className="learners-title font-20 bold">Learners ({classroom.students.length + classroom.studentsInvitations.length})</div>
            <div>
              {classroom.students.map(this.renderStudent.bind(this))}
              {classroom.studentsInvitations.map(this.renderInvitation.bind(this))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="bg-theme-dark-blue top-name-v431">
          {this.renderClassname()}
        </div>
        <div className="classroom-list one-classroom-assignments">
          {this.renderContent()}
        </div>
        <UnassignStudentDialog
          isOpen={this.state.unassignOpen}
          student={this.state.unassignStudent}
          close={() => this.setState({ unassignOpen: false })}
          submit={() => this.unassignStudent(this.state.unassignStudent)}
        />
      </div>
    );
  }
}

export default ClassroomList;
