import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import queryString from 'query-string';
import "swiper/swiper.scss";

import "../ViewAll.scss";
import brickActions from "redux/actions/brickActions";
import { User } from "model/user";
import { Notification } from 'model/notifications';
import { Subject, SubjectItem } from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import { getSubjects } from "services/axios/subject";
import map from "components/map";

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import SubjectsColumn from "./components/SubjectsColumn";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import AllSubjectsSidebar from "./AllSubjectsSidebar";
import ViewAllFilter, { SortBy } from "../components/ViewAllFilter";
import UnauthorizedSidebar from "./components/UnauthrizedSidebar";


interface AllSubjectsProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
  forgetBrick(): void;
}

interface AllSubjectsState {
  subjects: SubjectItem[];
  totalSubjects: Subject[];
  activeSubject: SubjectItem;
  showFilters: boolean;
  searchString: string;
  isAllSubjects: boolean;
  failedRequest: boolean;
}

class AllSubjectsPage extends Component<AllSubjectsProps, AllSubjectsState> {
  constructor(props: AllSubjectsProps) {
    super(props);

    let showFilters = false;
    const values = queryString.parse(props.location.search);
    if (values.filter) {
      showFilters = true;
    }

    this.state = {
      subjects: [],
      totalSubjects: [],
      activeSubject: {} as SubjectItem,
      failedRequest: false,
      searchString: '',
      isAllSubjects: true,
      showFilters
    };

    this.loadSubjects();
  }

  async loadSubjects() {
    let subjects = await getSubjects() as SubjectItem[] | null;

    if (subjects) {
      subjects.sort((s1, s2) => s1.name.localeCompare(s2.name));
      this.setState({ ...this.state, subjects, totalSubjects: subjects });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }
    return subjects;
  }

  search() {
    this.props.history.push(map.ViewAllPage + '?searchString=' + this.state.searchString);
  }

  onSubjectSelected(subjectId: number) {
    const { subjects } = this.state;
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      this.props.history.push(map.ViewAllPage + `?subjectId=${subject.id}`);
    }
  }

  render() {
    return (
      <div className="main-listing dashboard-page">
        <PageHeadWithMenu
          page={PageEnum.ViewAll}
          user={this.props.user}
          placeholder={"Search Subjects, Topics, Titles & more"}
          history={this.props.history}
          search={this.search.bind(this)}
          searching={v => this.setState({searchString: v})}
        />
        <Grid container direction="row" className="sorted-row">
          {this.state.showFilters ?
            <ViewAllFilter
              user={this.props.user}
              sortBy={SortBy.Date}
              subjects={this.state.subjects}
              userSubjects={this.props.user ? this.props.user.subjects : []}
              isCore={true}
              isClearFilter={() => { }}
              isAllSubjects={this.state.isAllSubjects}
              setAllSubjects={isAllSubjects => this.setState({isAllSubjects})}
              handleSortChange={() => { }}
              clearSubjects={() => { }}
              filterBySubject={id => this.onSubjectSelected(id)}
            />
            : this.props.user ? <AllSubjectsSidebar /> : <UnauthorizedSidebar />
          }
          <Grid item xs={9} className="brick-row-container">
            <SubjectsColumn
              subjects={this.state.totalSubjects}
              viewAll={() => this.props.history.push(map.ViewAllPage + `?isViewAll=${true}`)}
              onClick={this.onSubjectSelected.bind(this)}
            />
          </Grid>
        </Grid>
        <FailedRequestDialog
          isOpen={this.state.failedRequest}
          close={() => this.setState({ ...this.state, failedRequest: false })}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
});

export default connect(mapState, mapDispatch)(AllSubjectsPage);
