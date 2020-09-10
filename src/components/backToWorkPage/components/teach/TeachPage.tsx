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
import { checkAdmin, checkTeacher, checkEditor } from "components/services/brickService";
import { TeachFilters } from '../../model';

import Tab, { ActiveTab } from '../Tab';
import BackPagePagination from '../BackPagePagination';
import TeachFilterSidebar from './TeachFilterSidebar';
import ClassroomList from './ClassroomList';

interface TeachProps {
  searchString: string;
  isSearching: boolean;

  subjects: Subject[];
  activeTab: ActiveTab;
  setTab(t: ActiveTab): void;

  // redux
  user: User;
  getClassStats(id: number): void;
  requestFailed(e: string): void;
}

interface TeachState {
  isTeach: boolean;
  isAdmin: boolean;
  pageSize: number;
  sortedIndex: number;
  classrooms: TeachClassroom[];
  activeClassroom: TeachClassroom | null;
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

      filters: {
        assigned: false,
        completed: false
      },

      classrooms: [],
      activeClassroom: null,

      totalCount: 0,

      pageSize: 6,
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

  deactivateClassrooms() {
    for (let classroom of this.state.classrooms) {
      classroom.active = false;
    }
  }

  setActiveClassroom(id: number | null) {
    this.deactivateClassrooms();
    const { classrooms } = this.state;
    let classroom = classrooms.find(c => c.id === id);
    if (classroom) {
      this.props.getClassStats(classroom.id);
      classroom.active = true;
      this.setState({ sortedIndex: 0, classrooms, activeClassroom: classroom });
    } else {
      this.setState({ sortedIndex: 0, activeClassroom: null });
    }
  }

  teachFilterUpdated(filters: TeachFilters) {
    this.setState({ filters });
  }

  //#region pagination
  moveNext() {
    const index = this.state.sortedIndex;
    const itemsCount = this.getTotalCount();
    if (index + this.state.pageSize < itemsCount) {
      this.setState({ ...this.state, sortedIndex: index + this.state.pageSize });
    }
  }

  moveBack() {
    let index = this.state.sortedIndex;
    if (index >= this.state.pageSize) {
      this.setState({ ...this.state, sortedIndex: index - this.state.pageSize });
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

  renderTeachPagination = () => {
    let itemsCount = 0;
    if (this.state.activeClassroom) {
      itemsCount = this.state.activeClassroom.assignments.length;
    } else {
      itemsCount = this.getTotalCount();
    }
    return <BackPagePagination
      sortedIndex={this.state.sortedIndex}
      pageSize={this.state.pageSize}
      bricksLength={itemsCount}
      moveNext={this.moveNext.bind(this)}
      moveBack={this.moveBack.bind(this)}
    />
  }
  //#endregion

  render() {
    return (
      <Grid container direction="row" className="sorted-row">
        <TeachFilterSidebar
          classrooms={this.state.classrooms}
          setActiveClassroom={this.setActiveClassroom.bind(this)}
          filterChanged={this.teachFilterUpdated.bind(this)}
        />
        <Grid item xs={9} className="brick-row-container">
          <Tab
            isTeach={this.state.isTeach || this.state.isAdmin}
            activeTab={this.props.activeTab}
            setTab={t => this.props.setTab(t)}
          />
          <div className="tab-content">
            <ClassroomList
              subjects={this.props.subjects}
              expand={this.setActiveClassroom.bind(this)}
              startIndex={this.state.sortedIndex}
              activeClassroom={this.state.activeClassroom}
              pageSize={this.state.pageSize}
              classrooms={this.state.classrooms}
            />
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
