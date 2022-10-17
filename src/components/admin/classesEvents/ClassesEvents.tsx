import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

import './BricksPlayed.scss';
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import { getAllClassrooms } from 'components/teach/service';

import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import BricksPlayedSidebar, { PDateFilter } from "./BricksPlayedSidebar";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import { Subject } from "model/brick";
import { getSubjects } from "services/axios/subject";
import { ClassroomApi } from "components/teach/service";
import SpriteIcon from "components/baseComponents/SpriteIcon";


interface TeachProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  subjects: Subject[];
  selectedSubjects: Subject[];
  classrooms: ClassroomApi[];
  finalClassrooms: ClassroomApi[];
  dateFilter: PDateFilter;
}

class ClassesEvents extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    this.state = {
      dateFilter: PDateFilter.Past24Hours,
      subjects: [],
      selectedSubjects: [],
      classrooms: [],
      finalClassrooms: []
    }
    this.loadInitPlayedData();
  }

  async loadInitPlayedData() {
    const classrooms = await getAllClassrooms();
    if (classrooms) {
      this.setState({ classrooms, finalClassrooms: classrooms });
    }
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
  }

  search() { }
  searching() { }

  renderBody() {
    const { finalClassrooms } = this.state;
    if (finalClassrooms.length == 0) {
      return <div>No Bricks</div>;
    }

    return <div className="table-body">
      {finalClassrooms.map(c => {
        return (<div className="table-row">
          <div className="name-column">{c.name}</div>
          <div className="creator-column">{c.teachers[0].firstName} {c.teachers[0].lastName}</div>
          <div className="domain-column">domain</div>
          <div className="students-column">{c.students.length}</div>
          <div className="assigned-column">{c.assignmentsCount}</div>
        </div>);
      })}
    </div>
  }

  renderTable() {
    return (
      <div className="table">
        <div className="table-head bold">
          <div className="name-column header">
            <div>Name</div>
          </div>
          <div className="creator-column header">
            <div>Creator</div>
          </div>
          <div className="domain-column header">
            <div>Domain</div>
          </div>
          <div className="students-column header">
            <div>Students</div>
          </div>
          <div className="assigned-column header">Assigned</div>
        </div>
        {this.renderBody()}
      </div>
    );
  }

  render() {
    return (
      <div className="main-listing user-list-page manage-classrooms-page bricks-played-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={history}
          search={this.search.bind(this)}
          searching={this.searching.bind(this)}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <BricksPlayedSidebar
            isLoaded={true}
            dateFilter={this.state.dateFilter} setDateFilter={dateFilter => {

            }}
            subjects={this.state.subjects}
            selectedSubjects={this.state.selectedSubjects}
            selectSubjects={selectedSubjects => {
              this.setState({ selectedSubjects });
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Classes} history={this.props.history} />
            <div className="tab-content">
              <div className="flex-center">
                <div className="btn btn-green flex-center">
                  <div>Export</div>
                  <SpriteIcon name="upload" />
                </div>
              </div>
              {this.renderTable()}
            </div>
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

export default connect(mapState, mapDispatch)(ClassesEvents);
