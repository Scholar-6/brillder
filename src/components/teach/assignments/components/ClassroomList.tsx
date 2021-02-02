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
    this.setState({shown: true});
  }

  componentDidUpdate(props: ClassroomListProps) {
    if (this.props.activeClassroom !== props.activeClassroom) {
      console.log('refresh')
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
    const {classroom} = this.state;
    let items = [] as TeachListItem[];
    this.prepareClassItems(items, classroom);
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
        <Grow
          in={this.state.shown}
          style={{ transformOrigin: "0 0 0" }}
          timeout={700}
        >
          <div>
            {this.renderContent()}
          </div>
        </Grow>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ stats: state.stats.stats });

export default connect(mapState)(ClassroomList);
