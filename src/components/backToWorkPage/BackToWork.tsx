import React, { Component } from "react";
import queryString from 'query-string';
import { connect } from "react-redux";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';

import "./BackToWork.scss";
import map from 'components/map';
import { User, UserType } from "model/user";

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import { ActiveTab } from './components/Tab';
import BuildPage from './components/build/BuildPage';
import PlayPage from './components/play/PlayPage';
import { getTabLink } from "./service";

interface BackToWorkState {
  searchString: string;
  isSearching: boolean;
  dropdownShown: boolean;
  notificationsShown: boolean;
}

export interface BackToWorkProps {
  user: User;
  history: any;
  location: any;
  forgetBrick(): void;
  requestFailed(e: string): void;
}

class BackToWorkPage extends Component<BackToWorkProps, BackToWorkState> {
  constructor(props: BackToWorkProps) {
    super(props);

    this.state = {
      searchString: "",
      isSearching: false,

      dropdownShown: false,
      notificationsShown: false,
    };

    if (props.location.pathname === '/back-to-work') {
      this.setAutoTab();
    }
  }

  getActiveTab() {
    let activeTab = ActiveTab.Play;
    if (this.props.user.rolePreference?.roleId === UserType.Builder) {
      activeTab = ActiveTab.Build;
    }
    const values = queryString.parse(this.props.location.search);
    if (values.activeTab) {
      try {
        let queryTab = parseInt(values.activeTab as string) as ActiveTab;
        if (queryTab === ActiveTab.Build || queryTab === ActiveTab.Play) {
          activeTab = queryTab;
        }
      } catch { }
    }
    return activeTab;
  }

  setAutoTab() {
    const activeTab = this.getActiveTab();
    const link = getTabLink(activeTab);
    this.props.history.push(link);
  }

  setTab(activeTab: ActiveTab) {
    const link = getTabLink(activeTab);
    this.props.history.push(link);
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
          <Route path={map.BackToWorkBuildTab}>
            <BuildPage
              isSearching={this.state.isSearching}
              searchString={this.state.searchString}
              location={this.props.location}
              history={this.props.history}
              setTab={this.setTab.bind(this)}
            />
          </Route>
          <Route path={map.BackToWorkLearnTab}>
            <PlayPage
              history={this.props.history}
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
