import React, { Component } from "react";
import { connect } from "react-redux";
import { ReduxCombinedState } from "redux/reducers";

import './AssignmentsPage.scss';
import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import AssignmentPage from './components/play/AssignmentPage';
import { isMobile } from "react-device-detect";
import { isPhone } from "services/phone";
import AssignmentMobilePage from "./components/play/AssignmentMobilePage";

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

const MobileTheme = React.lazy(() => import('./themes/AssignmentsMobilePage'));
const TabletTheme = React.lazy(() => import('./themes/AssignmentsTabletPage'));
const DesktopTheme = React.lazy(() => import('./themes/AssignmentsDesktopPage'));


class AssignmentsPage extends Component<AssignmentProps, AssignmentState> {
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
        {isPhone() ? <MobileTheme /> : isMobile ? <TabletTheme /> : <DesktopTheme />}
        <div className="main-listing student-assignments-page">
          <PageHeadWithMenu
            page={PageEnum.BackToWork}
            user={this.props.user}
            placeholder="Live & Completed Assignments"
            history={this.props.history}
            searchHidden={true}
            search={() => this.search()}
            searching={(v: string) => this.searching(v)}
          />
          {isPhone()
            ? <AssignmentMobilePage history={this.props.history} match={this.props.match} />
            : <AssignmentPage history={this.props.history} match={this.props.match} />
          }
        </div>
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

export default connect(mapState)(AssignmentsPage);
