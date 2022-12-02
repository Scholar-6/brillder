import React, { Component } from "react";
import { connect } from "react-redux";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import './BuildPage.scss';
import { User } from "model/user";
import { Filters } from '../../model';
import { getBackToWorkStatistics } from "services/axios/brick";
import { Notification } from 'model/notifications';

import map from "components/map";
import PageLoader from "components/baseComponents/loaders/pageLoader";
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
  personalDraftCount: number;
  personalPublishCount: number;
  publishedCount: number;

  filters: Filters;
}

class BuildPage extends Component<BuildProps, BuildState> {
  constructor(props: BuildProps) {
    super(props);

    this.state = {
      publishedCount: 0,
      personalDraftCount: 0,
      personalPublishCount: 0,

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

    this.setCount();
  }

  async setCount() {
    const bricksCount = await getBackToWorkStatistics(true, true, false);
    if (bricksCount) {
      if (bricksCount.publishedCount != undefined && bricksCount.personalDraftCount != undefined && bricksCount.personalPublishCount != undefined) {
        this.setState({
          personalDraftCount: bricksCount.personalDraftCount,
          personalPublishCount: bricksCount.personalPublishCount,
          publishedCount: bricksCount.publishedCount
        });
      }
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
      history.push(map.MainPage);
      return <PageLoader content="" />;
    }

    if (this.isThreeColumns()) {
      return <ThreeColumnsPage
        personalDraftCount={this.state.personalDraftCount}
        personalPublishCount={this.state.personalPublishCount}
        publishedCount={this.state.publishedCount}

        filters={this.state.filters}
        filterUpdated={this.filterUpdated.bind(this)}

        isSearching={this.props.isSearching}
        searchString={this.props.searchString}
        searchDataLoaded={this.props.searchDataLoaded}
        searchFinished={() => this.props.searchFinished()}

        location={this.props.location}
        history={this.props.history}
      />;
    }
    return <BuildPageV2
      personalDraftCount={this.state.personalDraftCount}
      personalPublishCount={this.state.personalPublishCount}
      publishedCount={this.state.publishedCount}

      filters={this.state.filters}
      filterUpdated={this.filterUpdated.bind(this)}

      isSearching={this.props.isSearching}
      searchString={this.props.searchString}
      searchDataLoaded={this.props.searchDataLoaded}
      searchFinished={() => this.props.searchFinished()}

      location={this.props.location}
      history={this.props.history}
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
