import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import "swiper/swiper.scss";

import "./ViewAll.scss";
import brickActions from "redux/actions/brickActions";
import { User } from "model/user";
import { Notification } from 'model/notifications';
import { Subject, SubjectItem } from "model/brick";
import { ReduxCombinedState } from "redux/reducers";
import { getSubjects } from "services/axios/subject";
import map from "components/map";

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import ViewAllFilter, { SortBy } from "./ViewAllFilter";
import SubjectsColumn from "./components/SubjectsColumn";
import FailedRequestDialog from "components/baseComponents/failedRequestDialog/FailedRequestDialog";
import AllSubjectsSidebar from "./AllSubjectsSidebar";


interface ViewAllProps {
  user: User;
  notifications: Notification[] | null;
  history: any;
  location: any;
  forgetBrick(): void;
}

interface ViewAllState {
  subjects: SubjectItem[];
  totalSubjects: Subject[];
  activeSubject: SubjectItem;
  failedRequest: boolean;
}

class ViewAllPage extends Component<ViewAllProps, ViewAllState> {
  constructor(props: ViewAllProps) {
    super(props);

    this.state = {
      subjects: [],
      totalSubjects: [],
      activeSubject: {} as SubjectItem,
      failedRequest: false
    };

    this.loadSubjects();
  }

  async loadSubjects() {
    let subjects = await getSubjects() as SubjectItem[] | null;

    if(subjects) {
      subjects.sort((s1, s2) => s1.name.localeCompare(s2.name));
      this.setState({ ...this.state, subjects, totalSubjects: subjects });
    } else {
      this.setState({ ...this.state, failedRequest: true });
    }
    return subjects;
  }

  onSubjectSelected(subjectId: number) {
    const { subjects } = this.state;
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      this.props.history.push(map.ViewAllPage +`?subjectId=${subject.id}`);
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
          search={() => {}}
          searching={(v) => {}}
        />
        <Grid container direction="row" className="sorted-row">
          <AllSubjectsSidebar />
          <Grid item xs={9} className="brick-row-container">
            <SubjectsColumn
              subjects={this.state.totalSubjects}
              viewAll={() => this.props.history.push(map.ViewAllPage)}
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

export default connect(mapState, mapDispatch)(ViewAllPage);
