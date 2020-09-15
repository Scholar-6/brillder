import React, { Component } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import "./BackToWork.scss";
import { User } from "model/user";
import { Subject } from "model/brick";
import { checkTeacher } from "components/services/brickService";

import { loadSubjects, getGeneralSubject } from 'components/services/subject';
import { ActiveTab } from './components/Tab';

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { TeachClassroom } from "model/classroom";
import { getAllClassrooms } from "components/teach/service";

import TeachPage from './components/teach/TeachPage';
import BuildPage from './components/build/BuildPage';
import PlayPage from './components/play/PlayPage';

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
  stats: any;
  forgetBrick(): void;
  requestFailed(e: string): void;
}

class BackToWorkPage extends Component<BackToWorkProps, BackToWorkState> {
  constructor(props: BackToWorkProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user.roles);

    let activeTab = ActiveTab.Play;
    if (isTeach) {
      activeTab = ActiveTab.Teach;
    }

    this.state = {
      activeTab,
      subjects: [],

      isTeach,

      searchString: "",
      isSearching: false,
      dropdownShown: false,
      notificationsShown: false,

      generalSubjectId: -1,

      // Play
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
  }

  setTab(activeTab: ActiveTab) {
    this.deactivateClassrooms();
    this.setState({ activeTab });
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

  renderTeach() {
    if (this.state.activeTab !== ActiveTab.Teach) {
      return "";
    }
    return <TeachPage
      searchString={this.state.searchString}
      isSearching={this.state.isSearching}
      subjects={this.state.subjects}
      setTab={this.setTab.bind(this)}
    />;
  }

  renderBuild() {
    if (this.state.activeTab !== ActiveTab.Build) {
      return "";
    }
    if (this.state.generalSubjectId === - 1) {
      return "";
    }
    return (
      <BuildPage
        isSearching={this.state.isSearching}
        searchString={this.state.searchString}
        generalSubjectId={this.state.generalSubjectId}
        history={this.props.history}
        setTab={this.setTab.bind(this)}
      />
    );
  }

  renderPlay() {
    if (this.state.activeTab !== ActiveTab.Play) {
      return "";
    }
    return (
      <PlayPage
        history={this.props.history}
        classrooms={this.state.classrooms}
        setTab={this.setTab.bind(this)}
      />
    );
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
        {this.renderTeach()}
        {this.renderBuild()}
        {this.renderPlay()}
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(BackToWorkPage);
