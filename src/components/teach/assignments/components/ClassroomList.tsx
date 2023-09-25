import React, { Component } from "react";
import { Grow } from "@material-ui/core";
import { ReactSortable } from "react-sortablejs";

import './ClassroomList.scss';
import map from "components/map";
import { Subject } from "model/brick";
import { TeachClassroom, Assignment, TeachStudent } from "model/classroom";
import { updateClassroom, sortClassroomAssignments } from "services/axios/classroom";
import { convertClassAssignments } from "../service/service";
import { MUser } from "components/teach/model";
import { unassignStudent } from "components/teach/service";

import EmptyClassTab from "./EmptyClassTab";
import UnassignStudentDialog from "components/teach/assignments/UnassignStudentDialog";
import NameAndSubjectForm from "./NameAndSubjectForm";
import AssignedBrickDescription from "./AssignedBrickDescription";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import SortButtonV2 from "./SortButtonV2";
import { SortClassroom } from "./TeachFilterSidebar";
import SortButtonV3, { SortStudentV3 } from "./SortButtonV3";

export interface TeachListItem {
  id: number; // assignment id
  classroom: TeachClassroom;
  assignment: Assignment;
}

interface ClassroomListProps {
  history: any;
  subjects: Subject[];
  activeClassroom: TeachClassroom;
  reloadClass(id: number): void;
  assignPopup(): void;
  inviteStudents(): void;
  onDelete(classroom: TeachClassroom): void;
  onRemind?(count: number): void;
}

interface ListState {
  unassignOpen: boolean;
  unassignStudent: any;
  sortBy: SortClassroom;
  sortStudentBy: SortStudentV3;
  assignments: TeachListItem[];
}

class ClassroomList extends Component<ClassroomListProps, ListState> {
  constructor(props: ClassroomListProps) {
    super(props);

    const classroom = props.activeClassroom;
    let items = [] as TeachListItem[];
    convertClassAssignments(items, classroom);
    items = items.sort((a, b) => a.assignment.order - b.assignment.order);

    this.state = {
      unassignStudent: null,
      unassignOpen: false,
      sortBy: SortClassroom.Empty,
      sortStudentBy: SortStudentV3.Name,
      assignments: items,
    }

    for (let student of classroom.students) {
      student.completedCount = 0;
      for (let assignment of classroom.assignments) {
        if (assignment.byStudent) {
          for (let item of assignment.byStudent) {
            if (item.studentId == student.id) {
              student.completedCount += 1;
            }
          }
        }
      }
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
        <NameAndSubjectForm
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
            <AssignedBrickDescription
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

  async setAssignmentsOrder(assignments: any[], sort: SortClassroom) {
    let order = 1;
    for (let assignment of assignments) {
      assignment.order = order;
      order+=1;
    }

    const assignmentsData = assignments.map(a => { return {id: a.id, order: a.order}});
    this.setState({sortBy: sort, assignments});
    await sortClassroomAssignments(this.props.activeClassroom.id, assignmentsData);
  }

  renderStudent(s: TeachStudent, i: number) {
    return (
      <div className="student" key={i}>
        <div className="email-box">
          <div>
            <div className="name bold font-14">{s.firstName} {s.lastName}</div>
            <div className="email font-13">{s.email}</div>
          </div>
        </div>
        <div className="count-box">
          <div>{s.completedCount}/{this.props.activeClassroom.assignments.length}</div>
        </div>
        <div className="flex-center button-box">
          {this.renderLibraryLink(s)}
        </div>
        <div className="flex-center button-box">
          <div className="delete flex-center" onClick={() => {
            this.unassigningStudent(s);
          }}>
            <SpriteIcon name="delete" />
            <div className="css-custom-tooltip">Unassign Student</div>
          </div>
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
          }}>
            <SpriteIcon name="delete" />
            <div className="css-custom-tooltip">Remove Invite</div>
          </div>
        </div>
      </div>
    );
  }

  async sortAssignments(sort: SortClassroom) {
    let assignments = this.state.assignments;
    if (sort === SortClassroom.Name) {
      assignments = this.state.assignments.sort((a, b) => {
        const punctuation = /[\.,?!,'”<‘[(«]/g;
        const aText = a.assignment.brick.title.replace(punctuation, "");
        const bText = b.assignment.brick.title.replace(punctuation, "");
        return aText > bText ? 1 : -1;
      });
    } else if (sort === SortClassroom.Date) {
      assignments = this.state.assignments.sort((a, b) => {
        return new Date(b.assignment.assignedDate).getTime() - new Date(a.assignment.assignedDate).getTime();
      });
    } else if (sort === SortClassroom.DateInverse) {
      assignments = this.state.assignments.sort((a, b) => {
        return new Date(a.assignment.assignedDate).getTime() - new Date(b.assignment.assignedDate).getTime();
      });
    }
       
    this.setAssignmentsOrder(assignments, sort);
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
          <div className="bold assignments-title font-20">
            <div>Assignments</div>
            <div>
              <SortButtonV2
                sortBy={this.state.sortBy}
                sort={this.sortAssignments.bind(this)}
              />
            </div>
          </div>
          <ReactSortable
              list={this.state.assignments}
              className="drag-assignment"
              group="tabs-group"
              setList={async (newAssignments, e, r) => {
                let switched = newAssignments.find((q, i) => this.state.assignments[i].id !== q.id);
                if (switched) {
                  this.setAssignmentsOrder(newAssignments, SortClassroom.Empty);
                }
              }}
            >
              {this.state.assignments.map((item, i) => this.renderTeachListItem(item, i))}
            </ReactSortable>
        </div>
        <div className="students-column">
          <div>
            <div className="learners-title font-20 bold">
              <div className="learners-count">Learners ({classroom.students.length + classroom.studentsInvitations.length})</div>
              <div><SortButtonV3 sortBy={this.state.sortStudentBy} sort={sortStudentBy => {
                if (sortStudentBy === SortStudentV3.Name) {
                  classroom.students.sort((a, b) => a.firstName > b.firstName ? 1 : -1);
                } else if (sortStudentBy === SortStudentV3.NumberOfCompleted) {
                  classroom.students.sort((a, b) => b.completedCount - a.completedCount);
                }
                this.setState({sortStudentBy});
              }} /></div>
            </div>
            <div className="scrollable-students">
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
      <div className="container-d23423">
        <div className="top-name-v431">
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
