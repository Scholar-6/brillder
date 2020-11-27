import React, { Component } from "react";
import { connect } from "react-redux";

import "./BackToWork.scss";
import { ReduxCombinedState } from "redux/reducers";
import { User } from "model/user";

import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import BuildPage from './components/build/BuildPage';

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
        <BuildPage
          isSearching={this.state.isSearching}
          searchString={this.state.searchString}
          location={this.props.location}
          history={this.props.history}
        />
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

export default connect(mapState)(BackToWorkPage);
