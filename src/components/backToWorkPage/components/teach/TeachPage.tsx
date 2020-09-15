import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import statActions from 'redux/actions/stats';

import { TeachClassroom } from "model/classroom";
import { getAllClassrooms } from "components/teach/service";
import { User } from "model/user";
import { Subject } from "model/brick";
import { checkAdmin, checkTeacher } from "components/services/brickService";
import { TeachFilters } from '../../model';
import { Assignment } from "model/classroom";

import Tab, { ActiveTab } from '../Tab';
import BackPagePagination from '../BackPagePagination';
import TeachFilterSidebar from './TeachFilterSidebar';
import ClassroomList from './ClassroomList';
import ExpandedAssignment from './ExpandedAssignment';

interface TeachProps {
  searchString: string;
  isSearching: boolean;

  subjects: Subject[];
  setTab(t: ActiveTab): void;

  // redux
  user: User;
  getClassStats(id: number): void;
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
  totalCount: number;

  filters: TeachFilters;
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

      totalCount: 0,

      pageSize: 6,
      assignmentPageSize: 8,
      sortedIndex: 0,
    }
    getAllClassrooms().then((classrooms: any) => {
      if (classrooms) {
        this.setState({ classrooms: classrooms as TeachClassroom[] });
      } else {
        this.props.requestFailed('can`t get classrooms');
      }
    });
  }

  componentWillReceiveProps(nextProps: TeachProps) {
    if (nextProps.isSearching) {
      // search classrooms
    } else {
      if (this.props.isSearching === false) {
        //clear search
      }
    }
  }

  setActiveClassroom(id: number | null) {
    this.collapseClasses();
    const { classrooms } = this.state;
    let classroom = classrooms.find(c => c.id === id);
    if (classroom) {
      this.props.getClassStats(classroom.id);
      classroom.active = true;
      this.setState({ sortedIndex: 0, classrooms, activeClassroom: classroom, activeAssignment: null });
    } else {
      this.setState({ sortedIndex: 0, activeClassroom: null, activeAssignment: null });
    }
  }

  setActiveAssignment(classroomId: number, assignmentId: number) {
    this.collapseClasses();
    const classroom = this.state.classrooms.find(c => c.id === classroomId);
    if (classroom) {
      this.props.getClassStats(classroom.id);
      const assignment = classroom.assignments.find(c => c.id === assignmentId);
      if (assignment) {
        classroom.active = true;
        this.setState({ sortedIndex: 0, activeClassroom: classroom, activeAssignment: assignment });
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
    this.setState({ sortedIndex: 0, activeClassroom: null, activeAssignment: null });
  }

  teachFilterUpdated(filters: TeachFilters) {
    this.setState({ filters });
  }

  //#region pagination
  moveNext(pageSize: number) {
    const index = this.state.sortedIndex;
    const itemsCount = this.getTotalCount();
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
    const { classrooms } = this.state;
    let itemsCount = classrooms.length;
    for (const classroom of classrooms) {
      itemsCount += classroom.assignments.length;
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
      moveNext={() => this.moveNext(assignmentPageSize)}
      moveBack={() => this.moveBack(assignmentPageSize)}
    />
  }

  renderTeachPagination = () => {
    let itemsCount = 0;
    const {pageSize, activeClassroom} = this.state;
    if (activeClassroom && this.state.activeAssignment) {
      return this.renderAssignmentPagination(activeClassroom);
    } else if (activeClassroom) {
      itemsCount = activeClassroom.assignments.length;
    } else {
      itemsCount = this.getTotalCount();
    }
    return <BackPagePagination
      sortedIndex={this.state.sortedIndex}
      pageSize={this.state.pageSize}
      bricksLength={itemsCount}
      moveNext={() => this.moveNext(pageSize)}
      moveBack={() => this.moveBack(pageSize)}
    />
  }
  //#endregion

  render() {
    return (
      <Grid container direction="row" className="sorted-row">
        <TeachFilterSidebar
          classrooms={this.state.classrooms}
          activeClassroom={this.state.activeClassroom}
          setActiveClassroom={this.setActiveClassroom.bind(this)}
          filterChanged={this.teachFilterUpdated.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <Tab
            isTeach={this.state.isTeach || this.state.isAdmin}
            activeTab={ActiveTab.Teach}
            setTab={t => this.props.setTab(t)}
          />
          <div className="tab-content">
            <div className="classroom-list-buttons">
              {this.renderLiveBricksButton()}
              {this.renderArchiveButton()}
            </div>
            {this.state.activeAssignment && this.state.activeClassroom ?
              <ExpandedAssignment
                classroom={this.state.activeClassroom}
                assignment={this.state.activeAssignment}
                subjects={this.props.subjects}
                startIndex={this.state.sortedIndex}
                pageSize={this.state.assignmentPageSize}
                minimize={() => this.unselectAssignment()}
              />
              :
              <ClassroomList
                subjects={this.props.subjects}
                expand={this.setActiveAssignment.bind(this)}
                startIndex={this.state.sortedIndex}
                classrooms={this.state.classrooms}
                activeClassroom={this.state.activeClassroom}
                pageSize={this.state.pageSize}
              />
            }
            {this.renderTeachPagination()}
          </div>
        </Grid>
      </Grid>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
  getClassStats: (id: number) => dispatch(statActions.getClassStats(id))
});

export default connect(mapState, mapDispatch)(TeachPage);
