import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import './TeachPage.scss';
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import { User } from "model/user";
import { Subject } from "model/brick";
import { TeachClassroom, TeachStudent } from "model/classroom";
import { getAllClassrooms } from "components/teach/service";
import { checkAdmin, checkTeacher } from "components/services/brickService";
import { TeachFilters } from '../model';
import { Assignment } from "model/classroom";
import { getAssignmentStats } from "services/axios/stats";
import { ApiAssignemntStats } from "model/stats";
import { downKeyPressed, upKeyPressed } from "components/services/key";

import BackPagePagination from 'components/backToWorkPage/components/BackPagePagination';
import TeachFilterSidebar from './components/TeachFilterSidebar';
import ClassroomList from './components/ClassroomList';
import ActiveStudentBricks from "./components/ActiveStudentBricks";
import ExpandedAssignment from './components/ExpandedAssignment';
import TeachTab from "components/teach/TeachTab";
import { TeachActiveTab } from "components/teach/model";
import { getSubjects } from "services/axios/subject";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface TeachProps {
  history: any;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  isTeach: boolean;
  isAdmin: boolean;
  isArchive: boolean;
  pageSize: number;
  assignmentPageSize: number;
  sortedIndex: number;
  classrooms: TeachClassroom[];
  activeClassroom: TeachClassroom | null;
  activeAssignment: Assignment | null;
  activeStudent: TeachStudent | null;
  assignmentStats: ApiAssignemntStats | null;
  totalCount: number;
  subjects: Subject[];
  isSearching: boolean;
  isLoaded: boolean;

  filters: TeachFilters;
  handleKey(e: any): void;
}

class TeachPage extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user.roles);
    const isAdmin = checkAdmin(this.props.user.roles);

    this.state = {
      isAdmin,
      isTeach,

      isArchive: false,

      filters: {
        assigned: false,
        completed: false
      },

      classrooms: [],
      activeClassroom: null,
      activeAssignment: null,
      assignmentStats: null,
      activeStudent: null,
      isLoaded: false,

      totalCount: 0,
      isSearching: false,
      subjects: [],

      pageSize: 6,
      assignmentPageSize: 8,
      sortedIndex: 0,
      handleKey: this.handleKey.bind(this),
    };

    this.loadData();
  }

  componentDidMount() {
    document.addEventListener("keydown", this.state.handleKey, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.state.handleKey, false);
  }

  async loadData() {
    let subjects = await getSubjects();
    if (subjects) {
      this.setState({subjects});
    }
    const classrooms = await getAllClassrooms() as TeachClassroom[] | null;
    if (classrooms) {
      this.setState({ classrooms, isLoaded: true });
    } else {
      this.props.requestFailed('can`t get classrooms');
    }
  }

  handleKey(e: any) {
    let pageSize = this.state.pageSize;
    if (!this.state.activeStudent && this.state.activeClassroom && this.state.activeAssignment) {
      pageSize = this.state.assignmentPageSize;
    }
    if (upKeyPressed(e)) {
      this.moveBack(pageSize);
    } else if (downKeyPressed(e)) {
      this.moveNext(pageSize);
    }
  }

  setActiveStudent(activeStudent: TeachStudent) {
    this.setState({activeStudent, sortedIndex: 0});
  }

  setActiveClassroom(id: number | null) {
    this.collapseClasses();
    const { classrooms } = this.state;
    let classroom = classrooms.find(c => c.id === id);
    if (classroom) {
      classroom.active = true;
      this.setState({ sortedIndex: 0, classrooms, activeClassroom: classroom, activeAssignment: null, activeStudent: null, assignmentStats: null });
    } else {
      this.setState({ sortedIndex: 0, activeClassroom: null, activeStudent: null, activeAssignment: null, assignmentStats: null });
    }
  }

  async setActiveAssignment(classroomId: number, assignmentId: number) {
    this.collapseClasses();
    const classroom = this.state.classrooms.find(c => c.id === classroomId);
    if (classroom) {
      const assignment = classroom.assignments.find(c => c.id === assignmentId);
      if (assignment) {
        classroom.active = true;
        const assignmentStats = await getAssignmentStats(assignment.id);
        this.setState({ sortedIndex: 0, activeClassroom: classroom, activeAssignment: assignment, assignmentStats });
      }
    }    
  }

  collapseClasses() {
    for (let classroom of this.state.classrooms) {
      classroom.active = false;
    }
  }

  unselectAssignment() {
    this.collapseClasses();
    this.setState({ sortedIndex: 0, activeClassroom: null, activeAssignment: null, assignmentStats: null });
  }

  teachFilterUpdated(filters: TeachFilters) {
    this.setState({ filters });
  }

  //#region pagination
  moveNext(pageSize: number) {
    const index = this.state.sortedIndex;
    let itemsCount = this.getTotalCount();

    if (!this.state.activeStudent && this.state.activeAssignment && this.state.assignmentStats && this.state.activeClassroom) {
      itemsCount = this.state.activeClassroom.students.length;
    }

    console.log(index + pageSize, itemsCount)

    if (index + pageSize < itemsCount) {
      this.setState({ ...this.state, sortedIndex: index + pageSize });
    }
  }

  moveBack(pageSize: number) {
    let index = this.state.sortedIndex;
    if (index >= pageSize) {
      this.setState({ ...this.state, sortedIndex: index - pageSize });
    }
  }

  getTotalCount() {
    const { classrooms, activeClassroom } = this.state;
    let itemsCount = 0;
    if (activeClassroom) {
      itemsCount = activeClassroom.assignments.length + 0.5;
    } else {
      for (const classroom of classrooms) {
        itemsCount += 0.5;
        /*eslint-disable-next-line*/
        for (let a of classroom.assignments) {
          itemsCount += 1;
          if (((itemsCount + 0.5) % 6) === 0) {
            itemsCount += 0.5;
          }
        }
      }
    }
    return itemsCount;
  }

  renderArchiveButton() {
    let className = this.state.isArchive ? "active" : "";
    return <div className={className} onClick={() => this.setState({ isArchive: true })}>ARCHIVE</div>;
  }

  renderLiveBricksButton() {
    let className = this.state.isArchive ? "" : "active";
    return <div className={className} onClick={() => this.setState({ isArchive: false })}>LIVE BRICKS</div>;
  }

  renderAssignmentPagination = (classroom: TeachClassroom) => {
    const {assignmentPageSize} = this.state;
    const itemsCount = classroom.students.length;
    return <BackPagePagination
      sortedIndex={this.state.sortedIndex}
      pageSize={this.state.assignmentPageSize}
      bricksLength={itemsCount}
      isRed={this.state.sortedIndex === 0}
      moveNext={() => this.moveNext(assignmentPageSize)}
      moveBack={() => this.moveBack(assignmentPageSize)}
    />
  }

  renderTeachPagination = () => {
    let itemsCount = 0;
    const {pageSize, activeClassroom} = this.state;
    if (this.state.activeStudent) {
      return "";
    } else if (activeClassroom && this.state.activeAssignment) {
      return this.renderAssignmentPagination(activeClassroom);
    } else {
      itemsCount = this.getTotalCount();
    }
    return <BackPagePagination
      sortedIndex={this.state.sortedIndex}
      pageSize={this.state.pageSize}
      bricksLength={itemsCount}
      isRed={this.state.sortedIndex === 0}
      moveNext={() => this.moveNext(pageSize)}
      moveBack={() => this.moveBack(pageSize)}
    />
  }
  //#endregion

  renderTabContent() {
   
    if (!this.state.isLoaded) {
      return <div className="tab-content"></div>
    }
    /*
    if (this.state.isLoaded && this.state.classrooms.length === 0) {
      return (
        <div className="tab-content">
          <div className="tab-content-centered">
            <div>
              <SpriteIcon name="glasses-home-blue" />
              <div className="bold">Click the icon above to search for brick to assign</div>
            </div>
          </div>
        </div>
      );
    }*/
    return (
      <div className="tab-content">
        <div className="classroom-list-buttons">
          {this.renderLiveBricksButton()}
          {this.renderArchiveButton()}
        </div>
        { this.state.activeStudent ?
          <ActiveStudentBricks
            subjects={this.state.subjects}
            classroom={this.state.activeClassroom}
            activeStudent={this.state.activeStudent}
          />
          : this.state.activeAssignment && this.state.assignmentStats && this.state.activeClassroom ?
            <ExpandedAssignment
              classroom={this.state.activeClassroom}
              assignment={this.state.activeAssignment}
              stats={this.state.assignmentStats}
              subjects={this.state.subjects}
              startIndex={this.state.sortedIndex}
              pageSize={this.state.assignmentPageSize}
              history={this.props.history}
              minimize={() => this.unselectAssignment()}
            />
            :
            <ClassroomList
              subjects={this.state.subjects}
              expand={this.setActiveAssignment.bind(this)}
              startIndex={this.state.sortedIndex}
              classrooms={this.state.classrooms}
              activeClassroom={this.state.activeClassroom}
              pageSize={this.state.pageSize}
            />
        }
        {this.renderTeachPagination()}
      </div>
    );
  }

  render() {
    const {history} = this.props;

    return (
      <div className="main-listing user-list-page manage-classrooms-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Search by Name, Email or Subject"
          user={this.props.user}
          history={history}
          search={() => {}}
          searching={v => {}}
        />
      <Grid container direction="row" className="sorted-row back-to-work-teach">
        <TeachFilterSidebar
          classrooms={this.state.classrooms}
          activeClassroom={this.state.activeClassroom}
          setActiveClassroom={this.setActiveClassroom.bind(this)}
          setActiveStudent={this.setActiveStudent.bind(this)}
          filterChanged={this.teachFilterUpdated.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <TeachTab activeTab={TeachActiveTab.Assignments} history={history} />
          {this.renderTabContent()}
        </Grid>
      </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(TeachPage);
