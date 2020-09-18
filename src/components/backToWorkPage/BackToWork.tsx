import React, { Component } from "react";
import queryString from 'query-string';
import { connect } from "react-redux";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import "./BackToWork.scss";
import map from 'components/map';
import { User } from "model/user";
import { Subject } from "model/brick";
import { checkTeacher } from "components/services/brickService";
import { loadSubjects, getGeneralSubject } from 'components/services/subject';
import { TeachClassroom } from "model/classroom";
import { getAllClassrooms } from "components/teach/service";

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { ActiveTab } from './components/Tab';
import TeachPage from './components/teach/TeachPage';
import BuildPage from './components/build/BuildPage';
import PlayPage from './components/play/PlayPage';
import { getTabLink } from "./service";

interface BackToWorkState {
  searchString: string;
  isSearching: boolean;
  dropdownShown: boolean;
  notificationsShown: boolean;
  generalSubjectId: number;
  activeTab: ActiveTab;
  subjects: Subject[];

  isTeach: boolean;

  classrooms: TeachClassroom[];
  activeClassroom: TeachClassroom | null;
}

export interface BackToWorkProps {
  user: User;
  history: any;
  location: any;
  stats: any;
  forgetBrick(): void;
  requestFailed(e: string): void;
}

class BackToWorkPage extends Component<BackToWorkProps, BackToWorkState> {
  constructor(props: BackToWorkProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user.roles);
    const activeTab = this.getActiveTab(isTeach);

    this.state = {
      activeTab,
      subjects: [],

      isTeach,

      searchString: "",
      isSearching: false,
      dropdownShown: false,
      notificationsShown: false,

      generalSubjectId: -1,

      // Play, Teach
      classrooms: [],
      activeClassroom: null,
    };

    loadSubjects().then((subjects: Subject[] | null) => {
      if (!subjects) {
        this.props.requestFailed('Can`t get subjects');
        return;
      }
      let generalSubjectId = - 1;
      let generalSubject = getGeneralSubject(subjects);
      if (generalSubject) {
        generalSubjectId = generalSubject.id;
      }
      this.setState({ generalSubjectId, subjects });
    });

    getAllClassrooms().then((classrooms: any) => {
      if (classrooms) {
        this.setState({ classrooms: classrooms as TeachClassroom[] });
      } else {
        this.props.requestFailed('Can`t get classrooms');
      }
    });

    if (props.location.pathname === '/back-to-work') {
      this.setAutoTab(isTeach);
    }
  }

  getActiveTab(isTeach: boolean) {
    let activeTab = ActiveTab.Play;
    if (isTeach) {
      activeTab = ActiveTab.Teach;
    }
    const values = queryString.parse(this.props.location.search);
    if (values.activeTab) {
      try {
        let queryTab = parseInt(values.activeTab as string) as ActiveTab;
        if (queryTab === ActiveTab.Build || queryTab === ActiveTab.Play || queryTab === ActiveTab.Teach) {
          activeTab = queryTab;
        }
      } catch {}
    }
    return activeTab;
  }

  setAutoTab(isTeach: boolean) {
    const activeTab = this.getActiveTab(isTeach);
    const link = getTabLink(activeTab);
    this.props.history.push(link);
  }

  setTab(activeTab: ActiveTab) {
    this.deactivateClassrooms();
    const link = getTabLink(activeTab);
    this.props.history.push(link);
  }

  deactivateClassrooms() {
    for (let classroom of this.state.classrooms) {
      classroom.active = false;
    }
  }

  searching(searchString: string) {
    if (searchString.length === 0) {
      this.setState({
        ...this.state,
        searchString,
        isSearching: false,
      });
    } else {
      this.setState({ ...this.state, searchString });
    }
  }

  search() {
    this.setState({ ...this.state, isSearching: true });
  }

  render() {
    return (
      <div className="main-listing back-to-work-page">
        <PageHeadWithMenu
          page={PageEnum.BackToWork}
          user={this.props.user}
          placeholder="Search Ongoing Projects & Published Bricks…"
          history={this.props.history}
          search={() => this.search()}
          searching={(v: string) => this.searching(v)}
        />
        <Switch>
          <Route path={map.BackToWorkTeachTab}>
            <TeachPage
              searchString={this.state.searchString}
              isSearching={this.state.isSearching}
              subjects={this.state.subjects}
              setTab={this.setTab.bind(this)}
            />
          </Route>
          <Route path={map.BackToWorkBuildTab}>
            <BuildPage
              isSearching={this.state.isSearching}
              searchString={this.state.searchString}
              generalSubjectId={this.state.generalSubjectId}
              location={this.props.location}
              history={this.props.history}
              setTab={this.setTab.bind(this)}
            />
          </Route>
          <Route path={map.BackToWorkLearnTab}>
            <PlayPage
              history={this.props.history}
              classrooms={this.state.classrooms}
              generalSubjectId={this.state.generalSubjectId}
              setTab={this.setTab.bind(this)}
            />
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(BackToWorkPage);
