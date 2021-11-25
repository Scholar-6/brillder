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
import { getAssignmentsClassrooms } from "components/teach/service";
import MainAssignmentPagination from "./MainAssignmentPagination";
import PageLoader from "components/baseComponents/loaders/pageLoader";

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
  expand(classroomId: number, assignmentId: number): void;
  reloadClasses(): void;
  onRemind?(count: number, isDeadlinePassed: boolean): void;
}

interface State {
  page: number;
  pageSize: number;
  loaded: boolean;
  toggleState: boolean;
  classrooms: any[];
}

class ClassroomListV2 extends Component<ClassroomListProps, State> {
  constructor(props: ClassroomListProps) {
    super(props);

    this.state = {
      page: 0,
      pageSize: 6,
      toggleState: false,
      loaded:false,
      classrooms: props.classrooms
    }

    this.loadPageData(0, this.state.pageSize, props.classrooms);
  }

  componentDidUpdate(prevProps: ClassroomListProps, prevState: State) {
    if (this.props.classrooms != prevProps.classrooms) {
      this.loadPageData(0, this.state.pageSize, this.props.classrooms);
    }
    if (prevProps.isArchive !== this.props.isArchive) {
      this.loadPageData(0, this.state.pageSize, this.props.classrooms);
    }
  }

  async loadPageData(page: number, pageSize: number, classrooms: any[]) {
    let end = (page * pageSize) + pageSize;
    let index = 0;
    for (let classroom of classrooms) {
      index += 1;
      if (index <= end) {
        if (!classroom.assignments) {
          const assignments = await getAssignmentsClassrooms(classroom.id);
          if (assignments) {
            classroom.assignments = assignments;
          }
        }
      } else {
        break;
      }
      if (classroom.assignments) {
        index += classroom.assignments.length;
      }
    }
    setTimeout(() => {
      this.setState({ toggleState: !this.state.toggleState, loaded: true, classrooms });
    }, 200);
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
      this.props.reloadClasses();
    }
  }

  renderClassname(c: TeachListItem, index: number, i: number) {
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
        timeout={index * 200}
      >
        <div className={className}>
          <div>
            <NameAndSubjectForm
              classroom={classroom}
              inviteHidden={true}
              isArchive={this.props.isArchive}
              onAssigned={() => this.props.reloadClasses()}
              onChange={(name, subject) => this.updateClassroom(classroom, name, subject)}
            />
          </div>
        </div>
      </Grow>
    );
  }

  renderTeachList(items: TeachListItem[]) {
    let index = 1;

    if (!this.state.loaded) {
      return (
        <div className="page-loader-container">
          <PageLoader content="...Loading classroms..." />
        </div>
      );
    }

    return (
      <div>
        {items.map((c, i) => {
          if ((i >= (this.state.page * this.state.pageSize)) && i < ((this.state.page * this.state.pageSize) + this.state.pageSize)) {
            index++;
            if (c.assignment && c.classroom) {
              return (
                <Grow
                  in={true}
                  key={i}
                  style={{ transformOrigin: "left 0 0" }}
                  timeout={index * 200}
                >
                  <div>
                    <AssignedBrickDescription
                      subjects={this.props.subjects}
                      isArchive={this.props.isArchive}
                      expand={this.props.expand.bind(this)}
                      key={i} classroom={c.classroom} assignment={c.assignment}
                      archive={() => this.props.reloadClasses()}
                      unarchive={() => this.props.reloadClasses()}
                      onRemind={this.props.onRemind}
                    />
                  </div>
                </Grow>
              );
            }
            return this.renderClassname(c, index, i);
          }
          return "";
        })}
      </div>
    );
  }

  async moveNext() {
    const page = this.state.page + 1;
    await this.loadPageData(page, this.state.pageSize, this.state.classrooms);
    this.setState({ page });
  }

  moveBack() {
    const page = this.state.page - 1;
    if (page >= 0) {
      this.setState({ page })
    }
  }

  getClassIndex(items: any[], itemIndex: number) {
    let index = 0;
    let itemsCount = 0;
    for (const item of items) {
      if (itemIndex > itemsCount) {
        if (item.assignment) {
          index += 1;
        }
      }
      itemsCount += 1;
    }
    return index;
  }

  renderPagination(items: any[]) {
    const { pageSize, page } = this.state;
    let start = page * pageSize;
    let startIndex = this.getClassIndex(items, start);
    if (this.state.page === 0) {
      startIndex = 1;
    }
    let itemsCount = 0;
    let totalCount = 0;
    for (let cls of this.state.classrooms) {
      totalCount += 1;
      if (this.props.isArchive) {
        itemsCount += parseInt(cls.archivedAssignmentsCount);
        totalCount += parseInt(cls.archivedAssignmentsCount);
      } else {
        itemsCount += parseInt(cls.assignmentsCount) - parseInt(cls.archivedAssignmentsCount);
        totalCount += parseInt(cls.assignmentsCount) - parseInt(cls.archivedAssignmentsCount);
      }
    }
    let endIndex = this.getClassIndex(items, start + pageSize);
    return <MainAssignmentPagination
      sortedIndex={this.state.page * this.state.pageSize}
      pageSize={this.state.pageSize}
      bricksLength={totalCount}
      classStartIndex={startIndex}
      classEndIndex={endIndex}
      classroomsLength={itemsCount}
      isRed={false}
      moveNext={() => this.moveNext()}
      moveBack={() => this.moveBack()}
    />
  }

  prepareItems() {
    const { page, pageSize, classrooms } = this.state;
    console.log(classrooms);
    let items = [] as TeachListItem[];
    let notFirst = false;

    let index = 0;

    for (let classroom of classrooms) {
      if (this.props.isArchive) {
        if (classroom.archivedAssignmentsCount > 0) {
          index += 1;
          let item: TeachListItem = {
            classroom,
            notFirst,
            assignment: null
          };
          items.push(item);
        }
      } else {
        index += 1;
        let item: TeachListItem = {
          classroom,
          notFirst,
          assignment: null
        };
        items.push(item);
      }

      if (index <= (page * pageSize) + pageSize) {
        if (classroom.assignments) {
          index += classroom.assignments.length;
          convertClassAssignments(items, classroom, this.props.isArchive);
        } else {
          break;
        }
      }
      notFirst = true;
    }
    return items;
  }

  render() {
    const items = this.prepareItems();

    return (
      <div className="classroom-list many-classes">
        {this.renderTeachList(items)}
        {this.renderPagination(items)}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ stats: state.stats.stats });

export default connect(mapState)(ClassroomListV2);
