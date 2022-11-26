import React, { Component } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import './BuildPage.scss';
import { AcademicLevel, Brick, BrickLengthEnum, BrickStatus } from "model/brick";
import { User } from "model/user";
import { checkAdmin, checkTeacher, checkEditor } from "components/services/brickService";
import { Filters, SortBy } from '../../model';
import {  searchBricks } from "services/axios/brick";
import { Notification } from 'model/notifications';

import map from "components/map";
import PageLoader from "components/baseComponents/loaders/pageLoader";
import { SubjectItem } from "../personalBuild/model";
import { isPhone } from "services/phone";
import ThreeColumnsPage from "./ThreeColumnsPage";
import BuildPageV2 from "./BuildPageV2";


interface BuildProps {
  searchString: string;
  isSearching: boolean;
  searchDataLoaded: boolean;

  user: User;
  history: any;
  location: any;

  // redux
  notifications: Notification[] | null;
  searchFinished(): void;
  requestFailed(e: string): void;
}

interface BuildState {
  isTeach: boolean;
  isAdmin: boolean;
  isEditor: boolean;

  personalDraftCount: number;
  personalPublishCount: number;
  publishedCount: number;

  shown: boolean;
  sortBy: SortBy;
  sortedIndex: number;
  filters: Filters;
  pageSize: number;

  deleteDialogOpen: boolean;
  deleteBrickId: number;


  buildCheckedSubjectId: number;

  bricksLoaded: boolean;
}

class BuildPage extends Component<BuildProps, BuildState> {
  constructor(props: BuildProps) {
    super(props);

    const isTeach = checkTeacher(this.props.user);
    const isAdmin = checkAdmin(this.props.user.roles);
    const isEditor = checkEditor(this.props.user.roles)

    this.state = {
      isAdmin,
      isTeach,
      isEditor,

      shown: true,
      pageSize: 15,

      sortBy: SortBy.None,
      sortedIndex: 0,
      deleteDialogOpen: false,
      deleteBrickId: -1,

      publishedCount: 0,
      personalDraftCount: 0,
      personalPublishCount: 0,

      bricksLoaded: false,

      buildCheckedSubjectId: -1,

      filters: {
        draft: true,
        review: true,
        build: true,
        publish: false,
        isCore: true,

        level1: false,
        level2: false,
        level3: false,

        s20: false,
        s40: false,
        s60: false
      },
    }
  }

  isThreeColumns() {
    const { filters } = this.state;
    return filters.build && filters.review && filters.draft;
  }

  filterUpdated(newFilters: Filters) {
    const { filters } = this.state;
    filters.build = newFilters.build;
    filters.publish = newFilters.publish;
    filters.review = newFilters.review;
    filters.draft = newFilters.draft;

    this.setState({ ...this.state, filters });
    return filters;
  }

  render() {
    const { history } = this.props;
    if (isPhone()) {
      history.push(map.backToWorkUserBased(this.props.user));
      return <PageLoader content="" />;
    }

    if (this.isThreeColumns()) {
      return <ThreeColumnsPage
        filters={this.state.filters}
        filterUpdated={this.filterUpdated.bind(this)}
        isSearching={this.props.isSearching}
        searchString={this.props.searchString}
        searchDataLoaded={this.props.searchDataLoaded}
        location={this.props.location}
        history={this.props.history}
        searchFinished={() => this.props.searchFinished()}
      />;
    }
    return <BuildPageV2
      filters={this.state.filters}
      filterUpdated={this.filterUpdated.bind(this)}
      isSearching={this.props.isSearching}
      searchString={this.props.searchString}
      searchDataLoaded={this.props.searchDataLoaded}
      location={this.props.location}
      history={this.props.history}
      searchFinished={() => this.props.searchFinished()}
    />
  }
}

const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user,
  notifications: state.notifications.notifications
});

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e))
});

export default connect(mapState, mapDispatch)(BuildPage);
