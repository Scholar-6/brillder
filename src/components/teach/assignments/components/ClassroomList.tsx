import React, { Component } from "react";
import { connect } from "react-redux";
import { Grow } from "@material-ui/core";

import './ClassroomList.scss';
import { ReduxCombinedState } from "redux/reducers";
import { Subject } from "model/brick";
import { TeachClassroom, Assignment } from "model/classroom";

import { updateClassroom } from "services/axios/classroom";
import { convertClassAssignments } from "../service/service";
import EmptyClassTab from "./EmptyClassTab";
import AssignedBrickDescriptionV2 from "./AssignedBrickDescriptionV2";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import NameAndSubjectFormV3 from "components/teach/components/NameAndSubjectFormV3";

export interface TeachListItem {
  classroom: TeachClassroom;
  assignment: Assignment | null;
}

interface ClassroomListProps {
  stats: any;
  history: any;
  subjects: Subject[];
  activeClassroom: TeachClassroom;
  expand(classroomId: number, assignmentId: number): void;
  reloadClass(id: number): void;
  assignPopup(): void;
  inviteStudents(): void;
  onDelete(classroom: TeachClassroom): void;
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
      this.setState({ classroom: { ...classroom } });
      this.props.reloadClass(classroom.id);
    }
  }

  renderClassname() {
    const classroom = this.state.classroom as any;
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

  renderStudent(s: any, i: number) {
    return (
      <div className="student" key={i}>
        <div className="email-box">
          <div>
            <div className="name bold font-14">{s.firstName + ' ' + s.lastName}</div>
            <div className="email font-13">{s.email}</div>
          </div>
        </div>
        <div className="flex-center button-box">
          <div className="library flex-center"><SpriteIcon name="bar-chart-2" /></div>
        </div>
        <div className="flex-center button-box">
          <div className="delete flex-center"><SpriteIcon name="delete" /></div>
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
          <div className="delete flex-center"><SpriteIcon name="delete" /></div>
        </div>
      </div>
    );
  }

  renderContent() {
    const { classroom } = this.state;
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
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ stats: state.stats.stats });

export default connect(mapState)(ClassroomList);
