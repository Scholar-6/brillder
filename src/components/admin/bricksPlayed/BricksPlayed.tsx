import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

import './BricksPlayed.scss';
import { User } from "model/user";
import { Brick, Subject } from "model/brick";
import actions from 'redux/actions/requestFailed';
import { ReduxCombinedState } from "redux/reducers";
import BricksPlayedSidebar, { ESubjectCategory, PDateFilter, PSortBy } from "./BricksPlayedSidebar";
import BricksTab, { BricksActiveTab } from "./BricksTab";
import { adminGetBrickAtemptStatistic } from "services/axios/brick";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { getSubjects } from "services/axios/subject";


interface TeachProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  sortBy: PSortBy;
  dateFilter: PDateFilter;
  subjectCategory: ESubjectCategory;
  bricks: Brick[];
  selectedSubjects: Subject[];
  subjects: Subject[];
  finalBricks: Brick[];
}

class BricksPlayedPage extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    this.state = {
      sortBy: PSortBy.MostPlayed,
      dateFilter: PDateFilter.Today,
      subjectCategory: ESubjectCategory.Everything,
      bricks: [],
      subjects: [],
      selectedSubjects: [],
      finalBricks: []
    }
    this.loadInitData();
  }

  sortBricks(sortBy: PSortBy, bricks: Brick[]) {
    if (sortBy === PSortBy.MostPlayed) {
      return bricks.sort((a, b) => (a.attemptsCount > b.attemptsCount) ? -1 : 1);
    } else {
      return bricks.sort((a, b) => (a.attemptsCount > b.attemptsCount) ? 1 : -1);
    }
  }

  async loadInitData() {
    const bricks = await adminGetBrickAtemptStatistic(PDateFilter.Today);
    if (bricks) {
      const sortedBricks = this.sortBricks(PSortBy.MostPlayed, bricks);
      this.setState({ bricks: sortedBricks, finalBricks: sortedBricks });
    }

    const subjects = await getSubjects();
    if (subjects) {
      this.setState({subjects});
    }
  }

  async loadData(dateFilter: PDateFilter) {
    const bricks = await adminGetBrickAtemptStatistic(dateFilter);
    if (bricks) {
      const sortedBricks = this.sortBricks(this.state.sortBy, bricks);
      this.setState({ bricks: sortedBricks, dateFilter, finalBricks: sortedBricks });
    }
  }

  renderBody() {
    const { finalBricks } = this.state;
    if (finalBricks.length == 0) {
      return <div>No Bricks</div>;
    }
    return <div className="table-body">
      {finalBricks.map(b => {
        return (<div className="table-row">
          <div className="first-column" dangerouslySetInnerHTML={{ __html: b.title }} />
          <div className="second-column">{b.attemptsCount}</div>
          <div className="third-column">{b.isCore ? 'dd' : 'ss'}</div>
        </div>);
      })};
    </div>
  }

  render() {
    return (
      <div className="main-listing user-list-page manage-classrooms-page bricks-played-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={history}
          search={() => { }}
          searching={() => { }}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <BricksPlayedSidebar
            isLoaded={true}
            sortBy={this.state.sortBy} setSort={sortBy => {
              const finalBricks = this.sortBricks(sortBy, this.state.finalBricks);
              this.setState({ sortBy, finalBricks });
            }}
            dateFilter={this.state.dateFilter} setDateFilter={dateFilter => {
              this.loadData(dateFilter);
            }}
            subjects={this.state.subjects}
            selectedSubjects={this.state.selectedSubjects}
            selectSubjects={selectedSubjects => {
              this.setState({selectedSubjects});
            }}
            subjectCategory={this.state.subjectCategory} setSubjectCategory={subjectCategory => {
              this.setState({subjectCategory});
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Bricks} history={this.props.history} />
            <div className="tab-content">
              <div className="table">
                <div className="table-head bold">
                  <div className="first-column">Brick</div>
                  <div className="second-column">Times Played</div>
                  <div className="third-column">Visibility</div>
                </div>
                {this.renderBody()}
              </div>
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

export default connect(mapState, mapDispatch)(BricksPlayedPage);
