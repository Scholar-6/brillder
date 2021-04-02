import React, { Component } from "react";
import { connect } from "react-redux";
import { ReduxCombinedState } from "redux/reducers";

import { isIPad13, isMobile, isTablet } from 'react-device-detect';
import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import PlayPage from './components/play/PlayPage';

interface AssignmentState {
  searchString: string;
  isSearching: boolean;
  dropdownShown: boolean;
  notificationsShown: boolean;
}

export interface AssignmentProps {
  user: User;
  match: any;
  history: any;
  location: any;
  forgetBrick(): void;
}

const MobileTheme = React.lazy(() => import('./themes/AssignmentsPageMobileTheme'));
const TabletTheme = React.lazy(() => import('./themes/AssignmentsPageTabletTheme'));
const DesktopTheme = React.lazy(() => import('./themes/AssignmentsPageDesktopTheme'));

class BackToWorkPage extends Component<AssignmentProps, AssignmentState> {
  constructor(props: AssignmentProps) {
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
      <React.Suspense fallback={<></>}>
        {isIPad13 || isTablet ? <TabletTheme /> : isMobile ? <MobileTheme /> : <DesktopTheme />}
        <div className="main-listing student-assignments-page">
          <PageHeadWithMenu
            page={PageEnum.BackToWork}
            user={this.props.user}
            placeholder="Search Ongoing Projects & Published Bricks…"
            history={this.props.history}
            search={() => this.search()}
            searching={(v: string) => this.searching(v)}
          />
          <PlayPage history={this.props.history} match={this.props.match} />
        </div>
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

export default connect(mapState)(BackToWorkPage);
